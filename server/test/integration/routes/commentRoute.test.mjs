import request, {cookies} from "supertest";
import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, vi, it,} from "vitest";
import {redisConfig} from "../../../src/config/redisConfig.mjs";
import {createPool} from "mysql2/promise";
import Redis from "ioredis";
import {createApp} from "../../../src/app/app.mjs";
import {createVOPRFService} from "../../../src/services/auth/voprf/voprfService.mjs";
import {evaluator, voprfClient} from "../../../src/lib/voprf.mjs";
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

describe("commentRoute Integration", () => {
    let sqlPool
    let connection
    let redis
    let users
    let threads
    let parents
    let children
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
    const redisOption = {...redisConfig.option, db: dbIndex}

    beforeAll(async () => {
        sqlPool = createPool(process.env.DATABASE_URL)
        users = global.users
        threads = global.threads
        parents = global.parents
        children = global.children
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
    afterAll(async () => {
        await sqlPool.end()
        if (redis.status === 'end') return
        await redis.quit()
    })
    afterEach(async () => {
        await connection.rollback()
        connection.release()
        if (redis.status === 'end') return
        await redis.flushdb();
    })
    describe("GET /api/comments/:commentUuid", () => {
        it("success and return the comment", async () => {
            const res3 = await agent
                .get("/api/comments/" + children[0].commentUuid)
                .expect(200)
            expect(res3.body.data.comment).not.toBeNull()
            expect(res3.body.data.comment).toBeDefined()
        })
        it("return 400 error for invalid parameter", async () => {
            const res3 = await agent
                .get("/api/comments/" + "hello")
                .expect(400)
        })
        it("return 404 error for not found comment given parameter", async () => {
            const res3 = await agent
                .get("/api/comments/" + faker.string.uuid())
                .expect(404)
        })
    })
    describe("GET /api/comments/thread/:threadUuid", () => {
         it("success and return the thread and commentTree", async () => {
             const res3 = await agent
                 .get("/api/comments/thread/" + threads[0].threadUuid)
                 .expect(200)
             expect(res3.body.data.thread).not.toBeNull()
             expect(res3.body.data.thread).toBeDefined()
             expect(res3.body.data.comments).not.toBeNull()
             expect(res3.body.data.comments).toBeDefined()

         })
        it("return 400 error due to invalid parameter", async () => {
            const res3 = await agent
                .get("/api/comments/thread/" + "hello")
                .expect(400)
        })
        it("return 404 error due to can found given identifier", async () => {
            const res3 = await agent
                .get("/api/comments/thread/" + faker.string.uuid())
                .expect(404)
        })
    })
    describe("GET /api/comments/thread/:threadUuid/comment/:commentUuid", () => {
        it("return 200 and comment subTree", async () => {
            const res3 = await agent
                .get("/api/comments/thread/" + threads[0].threadUuid + "/comment/" + parents[0].commentUuid)
                .expect(200)
            expect(res3.body.data.comment).not.toBeNull()
            expect(res3.body.data.comment).toBeDefined()
        })
        it('return 400 due to invalid parameter', async () => {
            const res3 = await agent
                .get("/api/comments/thread/" + "hello"+ "/comment/" + parents[0].commentUuid)
                .expect(400)
        })
        it("return 404 due to thread", async () => {
            const res3 = await agent
                .get("/api/comments/thread/" + faker.string.uuid()+ "/comment/" + parents[0].commentUuid)
                .expect(404)
        })

    })
    describe("GET /api/comments/me", () => {
        it("return success and users' posted comment", async () => {
           await login(voprfService, users[0], agent)
           const res3 = await agent
               .get("/api/comments/me")
               .expect(200)
           const comments = res3.body.data.comments
           expect(comments).not.toBeNull()
           expect(comments).toBeDefined()
           for(const comment of comments){
               expect(comment.userUuid).toBe(users[0].userUuid)
           }
        })

        it("return 401 due to unset cookie", async () => {
            const res3 = await agent
                .get("/api/comments/me")
                .expect(401)

        })
    })

    describe("POST /api/comments/me/thread/threadUuid", () => {
        it("successfully post the comment", async () => {
           await login(voprfService, users[0], agent)
           const content = "this is a nice comment"
           const res3 = await agent
               .post("/api/comments/me/thread/" + threads[2].threadUuid)
               .send({content})
               .expect(200)
           const comment = res3.body.data.comment
           expect(comment.content).toBe(content)
           expect(comment.userUuid).toBe((users[0].userUuid))

        })
        it("return 401 due to unset cookie", async () => {
            const content = "this is a nice comment"
            const res3 = await agent
                .post("/api/comments/me/thread/" + threads[2].threadUuid)
                .send({content})
                .expect(401)
        })
        it("return 400 due to invalid parameter", async () => {
            await login(voprfService, users[0], agent)
            const content = "this is a nice comment"
            const res3 = await agent
                .post("/api/comments/me/thread/" + "hello")
                .send({content})
                .expect(400)

        })
        it("return 400 due to invalid payload", async () => {
            await login(voprfService, users[0], agent)
            const content = "this is a nice comment"
            const res3 = await agent
                .post("/api/comments/me/thread/" + "hello")
                .send({hello: "hello"})
                .expect(400)

        })
    })

    describe("POST /api/comments/me/thread/:threadUuid/comment/:parentCommentUuid", () => {
        it("successfully post the comment", async () => {
            await login(voprfService, users[0], agent)
            const content = "this is a nice comment"
            const res3 = await agent
                .post("/api/comments/me/thread/" + threads[2].threadUuid)
                .send({content})
                .expect(200)
            const comment = res3.body.data.comment
            expect(comment.content).toBe(content)
            expect(comment.userUuid).toBe((users[0].userUuid))
            const res4 = await agent
                .post("/api/comments/me/thread/" + threads[2].threadUuid + "/comment/" + comment.commentUuid)
                .send({content})
                .expect(200)
            const comment2 = res4.body.data.comment
            expect(comment2.content).toBe(content)
            expect(comment2.userUuid).toBe((users[0].userUuid))
            expect(comment2.parentCommentUuid).toBe(comment.commentUuid)
        })
        it( "return 401 due to unset cookie", async () => {
            const content = "this is a nice comment"
            const res3 = await agent
                .post("/api/comments/me/thread/" + threads[2].threadUuid + "/comment/" + parents[0].commentUuid)
                .send({content})
                .expect(401)
        })
        it("return 400 due to invalid parameter", async () => {
            await login(voprfService, users[0], agent)
            const content = "this is a nice comment"
            const res3 = await agent
                .post("/api/comments/me/thread/" + threads[2].threadUuid)
                .send({content})
                .expect(200)
            const comment = res3.body.data.comment
            expect(comment.content).toBe(content)
            expect(comment.userUuid).toBe((users[0].userUuid))
            const res4 = await agent
                .post("/api/comments/me/thread/" + threads[2].threadUuid + "/comment/" +  "bye")
                .send({content})
                .expect(400)
            const res5 = await agent
                .post("/api/comments/me/thread/" + "bye" + "/comment/" + "hello")
                .send({content})
                .expect(400)

        })
        it("return 400 due to invalid payload", async () => {
            await login(voprfService, users[0], agent)
            const content = "this is a nice comment"
            const res3 = await agent
                .post("/api/comments/me/thread/" + threads[2].threadUuid)
                .send({content})
                .expect(200)
            const comment = res3.body.data.comment
            expect(comment.content).toBe(content)
            expect(comment.userUuid).toBe((users[0].userUuid))
            const res4 = await agent
                .post("/api/comments/me/thread/" + threads[2].threadUuid + "/comment/" + comment.commentUuid)
                .send({hello: "hello"})
                .expect(400)
        })
        it("return 404 due to inconsistent threadUuid and userUuid", async () => {
            await login(voprfService, users[0], agent)
            const content = "this is a nice comment"
            const res3 = await agent
                .post("/api/comments/me/thread/" + threads[2].threadUuid)
                .send({content})
                .expect(200)
            const comment = res3.body.data.comment
            expect(comment.content).toBe(content)
            expect(comment.userUuid).toBe((users[0].userUuid))
            const res4 = await agent
                .post("/api/comments/me/thread/" + threads[2].threadUuid + "/comment/" + children[0].commentUuid)
                .send({content})
                .expect(404)
        })
    })
    describe("PATCH /api/comments/me/:commentUuid", () => {
        it("successfully patch the comment", async () => {
            await login(voprfService, users[0], agent)
            const content = "this is a nice comment"
            const res3 = await agent
                .post("/api/comments/me/thread/" + threads[2].threadUuid)
                .send({content})
                .expect(200)
            const comment = res3.body.data.comment
            expect(comment.content).toBe(content)
            expect(comment.userUuid).toBe((users[0].userUuid))
            const updatedContent =  "this is new comment"
            const res4 = await agent
                .patch("/api/comments/me/" + comment.commentUuid)
                .send({content: updatedContent})
                .expect(200)
            expect(res4.body.data.comment.content).toBe(updatedContent)
        })
        it("return 401 due to unset cookie", async () => {

            const updatedContent =  "this is new comment"
            const res4 = await agent
                .patch("/api/comments/me/" + parents[0].commentUuid)
                .send({content: updatedContent})
                .expect(401)
        })
        it("return 400 due to invalid parameter", async () => {
            await login(voprfService, users[0], agent)
            const content = "this is a nice comment"
            const res3 = await agent
                .post("/api/comments/me/thread/" + threads[2].threadUuid)
                .send({content})
                .expect(200)
            const comment = res3.body.data.comment
            expect(comment.content).toBe(content)
            expect(comment.userUuid).toBe((users[0].userUuid))
            const updatedContent =  "this is new comment"
            const res4 = await agent
                .patch("/api/comments/me/" + "hello")
                .send({content: updatedContent})
                .expect(400)
        })
        it("return 400 due to invalid parameter", async () => {
            await login(voprfService, users[0], agent)
            const content = "this is a nice comment"
            const res3 = await agent
                .post("/api/comments/me/thread/" + threads[2].threadUuid)
                .send({content})
                .expect(200)
            const comment = res3.body.data.comment
            expect(comment.content).toBe(content)
            expect(comment.userUuid).toBe((users[0].userUuid))
            const updatedContent =  "this is new comment"
            const res4 = await agent
                .patch("/api/comments/me/" + comment.commentUuid)
                .send({con: updatedContent})
                .expect(400)
        })
        it("return 401 due to no permisison to modify comment", async () => {
            await login(voprfService, users[0], agent)
            const content = "this is a nice comment"
            const res3 = await agent
                .post("/api/comments/me/thread/" + threads[2].threadUuid)
                .send({content})
                .expect(200)
            const comment = res3.body.data.comment
            expect(comment.content).toBe(content)
            expect(comment.userUuid).toBe((users[0].userUuid))
            const updatedContent =  "this is new comment"
            const res4 = await agent
                .patch("/api/comments/me/" + children[5].commentUuid)
                .send({content: updatedContent})
                .expect(401)
        })
    })

    describe("DELETE /api/comments/me:commentUuid", () => {
        it("successfully patch the comment", async () => {
            await login(voprfService, users[0], agent)
            const content = "this is a nice comment"
            const res3 = await agent
                .post("/api/comments/me/thread/" + threads[2].threadUuid)
                .send({content})
                .expect(200)
            const comment = res3.body.data.comment
            expect(comment.content).toBe(content)
            expect(comment.userUuid).toBe((users[0].userUuid))
            const updatedContent =  "this is new comment"
            const res4 = await agent
                .delete("/api/comments/me/" + comment.commentUuid)
                .expect(200)
        })
        it("return 401 due to unset cookie", async () => {
            const res4 = await agent
                .delete("/api/comments/me/" + parents[0].commentUuid)
                .expect(401)
        })
        it("return 400 due to invalid parameter", async () => {
            await login(voprfService, users[0], agent)
            const content = "this is a nice comment"
            const res3 = await agent
                .post("/api/comments/me/thread/" + threads[2].threadUuid)
                .send({content})
                .expect(200)
            const comment = res3.body.data.comment
            expect(comment.content).toBe(content)
            expect(comment.userUuid).toBe((users[0].userUuid))
            const updatedContent =  "this is new comment"
            const res4 = await agent
                .delete("/api/comments/me/" + "hello")
                .expect(400)
        })

        it("return 401 due to no permisison to modify comment", async () => {
            await login(voprfService, users[0], agent)
            const content = "this is a nice comment"
            const res3 = await agent
                .post("/api/comments/me/thread/" + threads[2].threadUuid)
                .send({content})
                .expect(200)
            const comment = res3.body.data.comment
            expect(comment.content).toBe(content)
            expect(comment.userUuid).toBe((users[0].userUuid))
            const updatedContent =  "this is new comment"
            const res4 = await agent
                .delete("/api/comments/me/" + parents[5].commentUuid)
                .expect(401)
        })
    })

})
