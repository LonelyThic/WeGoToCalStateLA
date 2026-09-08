import {describe, it, expect, afterEach, beforeAll, afterAll, beforeEach, vi} from 'vitest'
import {createApp} from "../../../src/app/app.mjs";
import {createPool} from "mysql2/promise";
import {redisConfig} from "../../../src/config/redisConfig.mjs";
import Redis from "ioredis";
import request, {cookies} from "supertest";
import {createVOPRFService} from "../../../src/services/auth/voprf/voprfService.mjs";
import {evaluator, voprfClient} from "../../../src/lib/voprf.mjs";
import {createUserRepo} from "../../../src/repositories/userRepository.mjs";
import {faker} from "@faker-js/faker";

describe("userRoute Integration", () => {
    let sqlPool
    let connection
    let redis
    let users
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
    describe("UserRoute Integration", () => {
        describe("GET /api/user/me", () => {
            it("return 200 and user data", async () => {
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
                    const res3 = await agent
                        .get("/api/user/me")
                        .expect(200)
                        .expect(cookies.not("set",{
                            name: "auth_tx",
                            options: ["path", "httponly", "samesite"],
                        }))
                    expect(res3.body.status).toBe("success")
                    const verify = res3.body.data.user
                    expect(verify.userUuid).toBe(user.userUuid)
                    expect(verify.username).toBe(user.username)
                    expect(verify.displayName).toBe(user.displayName)
                    expect(verify).toHaveProperty("createdAt")
                    expect(verify).toHaveProperty("updatedAt")
                }
            })
            it("return 401 due to unset auth_tx cookie", async () => {
                const res3 = await agent
                    .get("/api/user/me")
                    .expect(401)
                    .expect(cookies.not("set",{
                        name: "auth_tx",
                        options: ["path", "httponly", "samesite"],
                    }))
                console.log(res3.body)
                expect(res3.body.status).toBe("fail")
            })
            it("return 404 due to user not found base on the token uuid", async () => {
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
                const res2 = await agent
                    .post("/api/auth/login/complete")
                    .send({emailHashB64U, password: user.password })
                    .expect(200)
                    .expect(cookies.set({
                        name: "auth_tx",
                        options: ["path", "httponly", "samesite"],
                    }))
                expect(res2.body.status).toBe("success")
                //remvoe the user
                let userRepo = createUserRepo(connection)
                await userRepo.deleteByUserId(user.userId)
                const res3 = await agent
                    .get("/api/user/me")
                    .expect(404)
                    .expect(cookies.not("set",{
                        name: "auth_tx",
                        options: ["path", "httponly", "samesite"],
                    }))

            })
        })
        describe("PATCH /api/user/me", async () => {
            it("update the user field", async () => {
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
                    const res3 = await agent
                        .patch("/api/user/me")
                        .send({
                            displayName: "HEllo"
                        })
                        .expect(200)
                        .expect(cookies.not("set",{
                            name: "auth_tx",
                            options: ["path", "httponly", "samesite"],
                        }))
                    expect(res3.body.status).toBe("success")
                    const verify = res3.body.data.user
                    expect(verify.userUuid).toBe(user.userUuid)
                    expect(verify.username).toBe(user.username)
                    expect(verify.displayName).toBe("HEllo")
                    expect(verify).toHaveProperty("createdAt")
                    expect(verify).toHaveProperty("updatedAt")
                }
            })
            it("return 401 due to unset auth_tx cookie", async () => {
                const fancyName = faker.internet.username()
                const res3 = await agent
                    .patch("/api/user/me")
                    .send({displayName: fancyName})
                    .expect(401)
                    .expect(cookies.not("set",{
                        name: "auth_tx",
                        options: ["path", "httponly", "samesite"],
                    }))
                console.log(res3.body)
                expect(res3.body.status).toBe("fail")
            })
            it("return 400 due to validation", async () => {
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
                const res2 = await agent
                    .post("/api/auth/login/complete")
                    .send({emailHashB64U, password: user.password })
                    .expect(200)
                    .expect(cookies.set({
                        name: "auth_tx",
                        options: ["path", "httponly", "samesite"],
                    }))
                expect(res2.body.status).toBe("success")
                const fancyName = faker.internet.username()
                const res3 = await agent
                    .patch("/api/user/me")
                    .send({
                        display: fancyName
                    })
                    .expect(400)
                    .expect(cookies.not("set",{
                        name: "auth_tx",
                        options: ["path", "httponly", "samesite"],
                    }))
                expect(res3.body.status).toBe("fail")
                expect(res3.body.data).not.toHaveProperty("user")
            })
            it("return 404 due to user not found", async () => {
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
                const res2 = await agent
                    .post("/api/auth/login/complete")
                    .send({emailHashB64U, password: user.password })
                    .expect(200)
                    .expect(cookies.set({
                        name: "auth_tx",
                        options: ["path", "httponly", "samesite"],
                    }))
                expect(res2.body.status).toBe("success")
                //remvoe the user
                let userRepo = createUserRepo(connection)
                await userRepo.deleteByUserId(user.userId)
                const fancyName = faker.internet.username()
                const res3 = await agent
                    .patch("/api/user/me")
                    .send({displayName: fancyName})
                    .expect(404)
                    .expect(cookies.not("set",{
                        name: "auth_tx",
                        options: ["path", "httponly", "samesite"],
                    }))
                expect(res3.body.status).toBe("fail")
            })
        })

        describe("DELETE /api/user/me", () => {
           it("delete the user", async () => {
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
                   const res3 = await agent
                       .delete("/api/user/me")
                       .expect(200)
                       .expect(cookies.not("set",{
                           name: "auth_tx",
                           options: ["path", "httponly", "samesite"],
                       }))
                   expect(res3.body.status).toBe("success")
                   const userRepo = createUserRepo(connection)
                   expect(await userRepo.getCount()).toBe(users.length - i - 1)
               }
           })

            it("return 401 due to not found cookei", async () => {
                const res3 = await agent
                    .delete("/api/user/me")
                    .expect(401)
                    .expect(cookies.not("set",{
                        name: "auth_tx",
                        options: ["path", "httponly", "samesite"],
                    }))
                expect(res3.body.status).toBe("fail")
            })

            it("return 404 due to not found user", async () => {
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
                    const res3 = await agent
                        .delete("/api/user/me")
                        .expect(200)
                        .expect(cookies.not("set",{
                            name: "auth_tx",
                            options: ["path", "httponly", "samesite"],
                        }))
                    expect(res3.body.status).toBe("success")
                    const userRepo = createUserRepo(connection)
                    expect(await userRepo.getCount()).toBe(users.length - i - 1)
                    const res4 = await agent
                        .delete("/api/user/me")
                        .expect(404)
                        .expect(cookies.not("set",{
                            name: "auth_tx",
                            options: ["path", "httponly", "samesite"],
                        }))
                }
            })
        })

    })
})
