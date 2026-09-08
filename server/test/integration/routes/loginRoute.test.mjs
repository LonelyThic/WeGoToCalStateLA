import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi} from "vitest";
import {redisConfig} from "../../../src/config/redisConfig.mjs";
import {createPool} from "mysql2/promise";
import Redis from "ioredis";
import {createApp} from "../../../src/app/app.mjs";
import request, {cookies} from "supertest";
import {createUserRepo} from "../../../src/repositories/userRepository.mjs";
import {createRandomUser, seedUsers} from "../../seed.mjs";
import {createVOPRFService} from "../../../src/services/auth/voprf/voprfService.mjs";
import {faker} from "@faker-js/faker";
import {evaluator, voprfClient} from "../../../src/lib/voprf.mjs";


describe("loginRoute Integration", () => {
    let redis
    let sqlPool
    let connection
    const dbIndex = Number(process.env.VITEST_POOL_ID)
    const redisOption = {...redisConfig.option, db:dbIndex}
    let app
    let agent
    let lastOtp
    const emailService = {
        sendOTPEmail: vi.fn(async (_email, otpCode) => {
            lastOtp = otpCode;
        }),
    }
    let users
    beforeAll(async () => {
        sqlPool = createPool(process.env.DATABASE_URL)
        users = global.users
    }, )
    let userRepo
    let voprfService
    beforeEach(async () => {
        connection = await sqlPool.getConnection()
        await connection.beginTransaction()
        const redisUrl = process.env.REDIS_URL
        if (!redisUrl) throw new Error("REDIS_URL missing (ioredis would fallback to 127.0.0.1:6379)")
        redis = new Redis(redisUrl, redisOption)
        emailService.sendOTPEmail.mockClear()
        app = createApp(connection, redis, emailService)
        agent = request.agent(app)
        userRepo = createUserRepo(connection)
        voprfService = createVOPRFService({
            voprfClient,
            evaluator
        })
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
    describe("POST /api/auth/login/voprf", () => {
        it("success and return the evaluation", async () => {
            const email = faker.internet.email()
            const {finData, evalReqB64U}= await voprfService.bindVOPRF(email)
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
        })
        it("return 400 Bad Request due to invalid format or the evalReqB64U", async () => {
            const res = await agent
                .post("/api/auth/login/voprf")
                .send({evalReqB64U: "hello"})
                .expect('Content-Type', /json/)
                .expect(400)
                .expect(cookies.not("set", {
                    name: "login_tx",
                    options: ["path", "httponly", "samesite"],
                }))
            expect(res.body.status).toBe("fail")
        })
        it("return 503 Service Error due to redis down", async () => {
            await redis.quit()
            const email = faker.internet.email()
            const {finData, evalReqB64U}= await voprfService.bindVOPRF(email)
            const res = await agent
                .post("/api/auth/login/voprf")
                .send({evalReqB64U})
                .expect('Content-Type', /json/)
                .expect(503)
                .expect(cookies.not("set", {
                    name: "login_tx",
                    options: ["path", "httponly", "samesite"],
                }))
            expect(res.body.status).toBe("fail")
        })
    })
    describe("POST /api/auth/login/complete", () => {
        it("return 200 by completing voprf and recieve a auth-token cookie", async () => {
            for(let i = 0; i < users.length; i++){
                const user = users[i]
                const {finData, evalReqB64U}= await voprfService.bindVOPRF(user.email)
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
                    .send({emailHashB64U, password: user.password })
                    .expect(200)
                    .expect(cookies.set({
                        name: "auth_tx",
                        options: ["path", "httponly", "samesite"],
                    }))
                expect(res2.body.status).toBe("success")

            }
        })
        it("return 503 due to redis down", async () => {
            const user = users[0]
            const {finData, evalReqB64U}= await voprfService.bindVOPRF(user.email)
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
            await redis.quit()
            const res2 = await agent
                .post("/api/auth/login/complete")
                .send({emailHashB64U, password: user.password })
                .expect(503)
                .expect(cookies.not("set",{
                    name: "auth_tx",
                    options: ["path", "httponly", "samesite"],
                }))
            expect(res2.body.status).toBe("fail")
        })
        it("return 401 due cookie not exist", async () => {
            const user = users[1]
            const res2 = await agent
                .post("/api/auth/login/complete")
                .send({emailHashB64U: user.emailHash, password: user.password })
                .expect(401)
                .expect(cookies.not("set",{
                    name: "auth_tx",
                    options: ["path", "httponly", "samesite"],
                }))
            expect(res2.body.status).toBe("fail")
        })
        it("return 401 due to key not found", async () => {
            const user = users[0]
            const {finData, evalReqB64U}= await voprfService.bindVOPRF(user.email)
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
            await redis.flushdb()
            const emailHashB64U = await voprfService.unbindVOPRF(finData, res.body.data.evaluationB64U)
            const res2 = await agent
                .post("/api/auth/login/complete")
                .send({emailHashB64U, password: user.password })
                .expect(401)
                .expect(cookies.not("set",{
                    name: "auth_tx",
                    options: ["path", "httponly", "samesite"],
                }))
            expect(res2.body.status).toBe("fail")
        })

        it("return 404 due to not found user", async () => {
            const user = await createRandomUser()
            const {finData, evalReqB64U}= await voprfService.bindVOPRF(user.email)
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
                .send({emailHashB64U, password: user.password })
                .expect(404)
                .expect(cookies.not("set",{
                    name: "auth_tx",
                    options: ["path", "httponly", "samesite"],
                }))
            expect(res2.body.status).toBe("fail")
        })
        it("return 401 due to password not found", async () => {
            const user = users[0]
            const {finData, evalReqB64U}= await voprfService.bindVOPRF(user.email)
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
            const password = user.password + "1"
            const res2 = await agent
                .post("/api/auth/login/complete")
                .send({emailHashB64U, password})
                .expect(401)
                .expect(cookies.not("set",{
                    name: "auth_tx",
                    options: ["path", "httponly", "samesite"],
                }))
            expect(res2.body.status).toBe("fail")
        })
    })
})