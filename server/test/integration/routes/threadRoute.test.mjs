import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi} from "vitest";
import {redisConfig} from "../../../src/config/redisConfig.mjs";
import {createPool} from "mysql2/promise";
import Redis from "ioredis";
import {createApp} from "../../../src/app/app.mjs";
import {createVOPRFService} from "../../../src/services/auth/voprf/voprfService.mjs";
import {evaluator, voprfClient} from "../../../src/lib/voprf.mjs";
import request, {cookies} from "supertest";
import {faker} from "@faker-js/faker";

async function login(voprfService, user, agent) {
    const {finData, evalReqB64U} = await voprfService.bindVOPRF(user.email)
    const res = await agent
        .post("/api/auth/login/voprf")
        .send({evalReqB64U})
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(cookies.set({
            name: "login_tx",
            options: ["path", "httponly", "samesite"],
        }))
    expect(res.body.status).toBe("success")
    expect(res.body.data).toHaveProperty("evaluationB64U")
    const emailHashB64U = await voprfService.unbindVOPRF(finData, res.body.data.evaluationB64U)
    const res2 = await agent
        .post("/api/auth/login/complete")
        .send({emailHashB64U, password: user.password})
        .expect(200)
        .expect(cookies.set({
            name: "auth_tx",
            options: ["path", "httponly", "samesite"],
        }))
    expect(res2.body.status).toBe("success")
}

describe("threadRoute Integration", () => {
    let sqlPool
    let connection
    let redis
    let users
    let threads
    let app
    let voprfService
    let agent
    let lastOtp
    const emailService = {
        sendOTPEmail: vi.fn(async (_email, otpCode) => {
            lastOtp = otpCode;
        }),
    }
    const dbIndex = Number(process.env.VITEST_POOL_ID)
    const redisOption = {...redisConfig.option, db:dbIndex}

    beforeAll(async () => {
        sqlPool= createPool(process.env.DATABASE_URL)
        users = global.users
        threads = global.threads
    })

    beforeEach(async () => {
        connection = await sqlPool.getConnection()
        await connection.beginTransaction()
        const redisUrl = process.env.REDIS_URL
        if (!redisUrl) throw new Error("REDIS_URL missing (ioredis would fallback to 127.0.0.1:6379)")
        redis = new Redis(redisUrl, redisOption)
        emailService.sendOTPEmail.mockClear()
        lastOtp = null
        app = createApp(connection, redis, emailService)
        voprfService = createVOPRFService({voprfClient, evaluator})
        agent = request.agent(app)
    })
    afterAll(async ()=> {
        await sqlPool.end()
        if(redis.status === 'end') return
        await redis.quit()
    })
    afterEach(async () => {
        await connection.rollback()
        connection.release()
        if(redis.status === 'end') return
        await redis.flushdb();
    })
    describe("GET /api/threads/", () => {
        it("return 200 and all thread data", async () => {
            const res = await agent
                .get("/api/threads/")
                .expect(200)
            for(const verify of res.body.data.threads){
                console.log(verify)
                expect(verify).toHaveProperty("threadUuid")
                expect(verify).toHaveProperty("userUuid")
                expect(verify).toHaveProperty("body")
                expect(verify).not.toHaveProperty("content")
                expect(verify).toHaveProperty("title")
                expect(verify).toHaveProperty("author")
                expect(verify).not.toHaveProperty("username")
                expect(verify).toHaveProperty("createdAt")
                expect(verify).toHaveProperty("updatedAt")
                expect(verify).toHaveProperty("status")
            }
        })
    })
    describe("GET /api/threads/me", () => {
        it("return 200 and all thread post by users", async () => {
            for(let i = 0; i < users.length; i++) {
                const user = users[i]
                await login(voprfService,users[i],agent)
                const res3 = await agent
                    .get("/api/threads/me")
                    .expect(200)
                for(const thread of res3.body.data.threads){
                    expect(thread.userUuid).toBe(user.userUuid)
                }
            }
        })
        it("return 401 due to no auth_tx", async () => {
            const res3 = await agent
                .get("/api/threads/me")
                .expect(401)
        })
    })
    describe("POST /api/threads/me", () => {
        it("post the thread", async () => {
            for(let i = 0; i < users.length; i++) {
                const user = users[i]
                await login(voprfService, user, agent);
                const title = faker.lorem.paragraph({
                    min:2,
                    max: 2
                })
                const content = faker.lorem.paragraphs()
                const res3 = await agent
                    .post("/api/threads/me")
                    .send({title, content})
                    .expect(200)
                const verify = res3.body.data.thread
                expect(verify.title).toBe(title)
                expect(verify.body).toBe(content)
                expect(verify.userUuid).toBe(user.userUuid)

            }
        })
        it("return 401 due to unset auth_tx cookie", async () => {
            const title = faker.lorem.paragraph()
            const content = faker.lorem.paragraphs()
            const res3 = await agent
                .post("/api/threads/me")
                .send({title, content})
                .expect(401)
        })
        it("return 400 due to validation error", async () => {
            await login(voprfService, users[0], agent)
            let res3 = await agent
                .post("/api/threads/me")
                .send({title:"hello", content:"bye"})
                .expect(400)

            let res4 = await agent
                .post("/api/threads/me")
                .send({title: faker.lorem.paragraph()})
                .expect(400)
        })

    })
    describe("PATCH /api/threads/me/:threadUuid", () => {
        it("successfully patched the thread", async () => {
            await login(voprfService, users[0], agent)
            const thread = threads[0]
            const title = faker.lorem.paragraph()
            const res3 = await agent
                .patch("/api/threads/me/" + thread.threadUuid)
                .send({title})
                .expect(200)
            const verify = res3.body.data.thread
            expect(verify.title).toBe(title)
            expect(verify.userUuid).toBe(users[0].userUuid)
            expect(verify.threadUuid).toBe(thread.threadUuid)
        })
        it("return 401 due to unset auth_tx", async () => {
            const thread = threads[0]
            const title = faker.lorem.paragraph()
            const res3 = await agent
                .patch("/api/threads/me/" + thread.threadUuid)
                .send({title})
                .expect(401)
        })
        it("return 400 due to non uuid format for parameter threadUuid", async () => {
            await login(voprfService, users[0], agent)
            const thread = threads[0]
            const title = faker.lorem.paragraph()
            const res3 = await agent
                .patch("/api/threads/me/" + "123")
                .send({title})
                .expect(400)
        })
        it("return 401 unauthorized due to no permission", async () => {
            await login(voprfService, users[0], agent)
            const thread = threads[4]
            const title = faker.lorem.paragraph()
            const res3 = await agent
                .patch("/api/threads/me/" + thread.userUuid)
                .send({title})
                .expect(401)
        })

    })

    describe("DELETE /api/threads/me/:threadUuid", () => {
        it("return 200 for deleting the user", async () => {
            await login(voprfService, users[0], agent)
            const thread = threads[0]
            const res3 = await agent
                .delete("/api/threads/me/" + thread.threadUuid)
                .expect(200)
        })
        it("return 401 for unset auth_tx cookie", async () => {
            const thread = threads[0]
            const res3 = await agent
                .delete("/api/threads/me/" + thread.threadUuid)
                .expect(401)
        })
        it("return 400 for bad parameter", async () => {
            await login(voprfService, users[0], agent)
            const res3 = await agent
                .delete("/api/threads/me/" + "idJ")
                .expect(400)
        })
        it("return 401 for no permission", async () => {
            await login(voprfService, users[0], agent)
            const res3 = await agent
                .delete("/api/threads/me/" + threads[5].threadUuid)
                .expect(401)
        })
    })
    describe("GET /api/threads/:threadUuid", () => {
        it("return 200 with the thread data", async () => {
            const thread = threads[0]
            const res = await agent
                .get("/api/threads/" + thread.threadUuid)
                .expect(200)
            const verify = res.body.data.thread
            expect(verify).toHaveProperty("threadUuid")
            expect(verify).toHaveProperty("userUuid")
            expect(verify).toHaveProperty("body")
            expect(verify).not.toHaveProperty("content")
            expect(verify).toHaveProperty("title")
            expect(verify).toHaveProperty("author")
            expect(verify).not.toHaveProperty("username")
            expect(verify).toHaveProperty("createdAt")
            expect(verify).toHaveProperty("updatedAt")
            expect(verify).toHaveProperty("status")
        })
        it("return 400 due to invalid parameter", async () => {
            const thread = threads[0]
            const res = await agent
                .get("/api/threads/" + "hello")
                .expect(400)

        })
    })
})
