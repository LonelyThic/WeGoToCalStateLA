import {afterEach, beforeAll, beforeEach, describe, expect, it, vi, afterAll} from "vitest";
import {setupRedis, setupSQL} from "../../utils/containerSetup.mjs";
import Redis from "ioredis";
import {redisConfig} from "../../../src/config/redisConfig.mjs";
import {createApp} from "../../../src/app/app.mjs";
import request, {cookies} from "supertest";
import {faker} from "@faker-js/faker";
import {createPool} from "mysql2/promise";
import connectionPool from "../../../src/lib/pool.mjs";

describe("emailOTP route", () => {
    let redis
    let sqlPool
    let lastOtp = null;
    const emailService = {
        sendOTPEmail: vi.fn(async (_email, otpCode) => {
            lastOtp = otpCode;
        }),
    }
    let connection
    let app
    let agent
    const dbIndex = Number(process.env.VITEST_POOL_ID)
    const redisOption = {...redisConfig.option, db:dbIndex}
    beforeAll(async () => {
        sqlPool = createPool(process.env.DATABASE_URL)
    }, )

    beforeEach(async () => {
        const redisUrl = process.env.REDIS_URL
        if (!redisUrl) throw new Error("REDIS_URL missing (ioredis would fallback to 127.0.0.1:6379)")
        redis = new Redis(redisUrl, redisOption)
        emailService.sendOTPEmail.mockClear()
        lastOtp = null
        connection = await sqlPool.getConnection()
        app = createApp(connection, redis, emailService)
        agent = request.agent(app)
        await connection.beginTransaction()
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
    describe("POST /api/auth/otp/send", async () => {
        it("returns 200 and sets otp_tx cookie", async () => {
            const email = faker.internet.email()
            const res = await request(app)
                .post("/api/auth/otp/send")
                .send({ email})
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(cookies.set({ name: "otp_tx", options: ["path", "httponly", "samesite"] }))
            expect(res.body.status).toBe("success"  )
            expect(emailService.sendOTPEmail).toHaveBeenCalledTimes(1)
            expect(lastOtp).toBeTruthy()
        })

        it("return 400 and validation error when email is invalid", async () => {
            const email = faker.lorem.sentence()
            const res = await request(app)
                .post("/api/auth/otp/send")
                .send({ email})
                .expect('Content-Type', /json/)
                .expect(400)
                .expect(cookies.not('set', {name: "otp_tx"}))
            expect(res.body.status).toBe("fail")
            expect(res.body.data).toHaveProperty("email")
            expect(emailService.sendOTPEmail).toHaveBeenCalledTimes(0)
            expect(lastOtp).toBeNull()

        })
        it("return 400 and validation error when extra field is there", async () => {
            const email = faker.internet.email()
            const res = await request(app)
                .post("/api/auth/otp/send")
                .send({ email, something: "hello"})
                .expect('Content-Type', /json/)
                .expect(400)
                .expect(cookies.not('set', {name: "otp_tx"}))
            expect(res.body.status).toBe("fail")
            expect(res.body.data).toHaveProperty("_global")
            expect(emailService.sendOTPEmail).toHaveBeenCalledTimes(0)
            expect(lastOtp).toBeNull()

        })

        it("return 503 and due to redis down", async () => {
            await redis.quit()
            const email = faker.internet.email()
            const res = await request(app)
                .post("/api/auth/otp/send")
                .send({ email})
                .expect('Content-Type', /json/)
                .expect(503)
                .expect(cookies.not('set', {name: "otp_tx"}))
            expect(emailService.sendOTPEmail).toHaveBeenCalledTimes(0)
            expect(lastOtp).toBeNull()

        })
    })
    describe("POST /api/auth/otp/verify", () => {
        it("return 200 and set signup_tx cookie", async () => {
            const email = faker.internet.email()
            const res1 = await agent
                .post("/api/auth/otp/send")
                .send({ email})
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(cookies.set({ name: "otp_tx", options: ["path", "httponly", "samesite"] }));
            console.log(res1.headers["set-cookie"])
            expect(res1.body.status).toBe("success"  )
            expect(emailService.sendOTPEmail).toHaveBeenCalledTimes(1)
            expect(lastOtp).toBeTruthy()

            const res2 = await agent
                .post("/api/auth/otp/verify")
                .send({otp: lastOtp})
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(cookies.set({ name: "signup_tx", options: ["path", "httponly", "samesite"] }));
            expect(res2.body.status).toBe("success")
        })
        it("return 401 due to no set otp_tx cookie", async () => {
            const res2 = await agent
                .post("/api/auth/otp/verify")
                .send({otp: lastOtp})
                .expect('Content-Type', /json/)
                .expect(401)
                .expect(cookies.not("set", {name: "signup_tx", options: ["path", "httponly", "samesite"]}))
            expect(res2.body.status).toBe("fail")
        })
        it("return 400 due to wrong formated of body", async () => {
            const email = faker.internet.email()
            const res1 = await agent
                .post("/api/auth/otp/send")
                .send({ email})
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(cookies.set({ name: "otp_tx", options: ["path", "httponly", "samesite"] }));
            expect(res1.body.status).toBe("success"  )
            expect(emailService.sendOTPEmail).toHaveBeenCalledTimes(1)
            expect(lastOtp).toBeTruthy()

            const res2 = await agent
                .post("/api/auth/otp/verify")
                .send({otp: "12345678"})
                .expect('Content-Type', /json/)
                .expect(400)
                .expect(cookies.not("set", {name: "signup_tx", options: ["path", "httponly", "samesite"]}))
            expect(res2.body.status).toBe("fail")
            expect(res2.body.data.otp).toBe("Must be a string of exactly 6 digits")

        })
        it("return 503 due to redis service down", async () => {
            const email = faker.internet.email()
            const res1 = await agent
                .post("/api/auth/otp/send")
                .send({ email})
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(cookies.set({ name: "otp_tx", options: ["path", "httponly", "samesite"] }));
            expect(res1.body.status).toBe("success"  )
            expect(emailService.sendOTPEmail).toHaveBeenCalledTimes(1)
            expect(lastOtp).toBeTruthy()
            await redis.quit()
            const res2 = await agent
                .post("/api/auth/otp/verify")
                .send({otp: lastOtp})
                .expect('Content-Type', /json/)
                .expect(503)
                .expect(cookies.not("set", {name: "signup_tx", options: ["path", "httponly", "samesite"]}))
            console.log(res2.body)
            expect(res2.body.status).toBe("fail")
            expect(res2.body.data.error).toBe("Service down")
            expect(res2.body.message).toBe("Signup service is temporarily unavailable. Please try again later.")
        })

        it("return 401 due to not found record using otp Token", async () => {
            const email = faker.internet.email()
            const res1 = await agent
                .post("/api/auth/otp/send")
                .send({ email})
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(cookies.set({ name: "otp_tx", options: ["path", "httponly", "samesite"] }));
            expect(res1.body.status).toBe("success"  )
            expect(emailService.sendOTPEmail).toHaveBeenCalledTimes(1)
            expect(lastOtp).toBeTruthy()
            //wipe db cause key can not found
            await redis.flushdb();
            const res2 = await agent
                .post("/api/auth/otp/verify")
                .send({otp: lastOtp})
                .expect('Content-Type', /json/)
                .expect(401)
                .expect(cookies.not("set", {name: "signup_tx", options: ["path", "httponly", "samesite"]}))
            expect(res2.body.status).toBe("fail")
            expect(res2.body.data.otp).toBe("Record don't exist")
            expect(res2.body.message).toBe("OTP expired. Please try again")
        })

        it("return 401 due to wrong otp Code", async () => {
            const email = faker.internet.email()
            const res1 = await agent
                .post("/api/auth/otp/send")
                .send({ email})
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(cookies.set({ name: "otp_tx", options: ["path", "httponly", "samesite"] }));
            expect(res1.body.status).toBe("success"  )
            expect(emailService.sendOTPEmail).toHaveBeenCalledTimes(1)
            expect(lastOtp).toBeTruthy()

            const res2 = await agent
                .post("/api/auth/otp/verify")
                .send({otp: "123456"})
                .expect('Content-Type', /json/)
                .expect(401)
                .expect(cookies.not("set", {name: "signup_tx", options: ["path", "httponly", "samesite"]}))
            expect(res2.body.status).toBe("fail")
            expect(res2.body.data.otp).toBe("Not matched")
            expect(res2.body.message).toBe("The code does not match our record")
        })
        it("return 401 due to 5 wrong attempts ", async () => {
            const email = faker.internet.email()
            const res1 = await agent
                .post("/api/auth/otp/send")
                .send({ email})
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(cookies.set({ name: "otp_tx", options: ["path", "httponly", "samesite"] }));
            expect(res1.body.status).toBe("success"  )
            expect(emailService.sendOTPEmail).toHaveBeenCalledTimes(1)
            expect(lastOtp).toBeTruthy()
            for(let i = 0; i < 5; i++){
                const res2 = await agent
                    .post("/api/auth/otp/verify")
                    .send({otp: "123456"})
                    .expect('Content-Type', /json/)
                    .expect(401)
                    .expect(cookies.not("set", {name: "signup_tx", options: ["path", "httponly", "samesite"]}))
                expect(res2.body.status).toBe("fail")
                expect(res2.body.data.otp).toBe("Not matched")
                expect(res2.body.message).toBe("The code does not match our record")
            }
            const res2 = await agent
                .post("/api/auth/otp/verify")
                .send({otp: "123456"})
                .expect('Content-Type', /json/)
                .expect(401)
                .expect(cookies.not("set", {name: "signup_tx", options: ["path", "httponly", "samesite"]}))
            expect(res2.body.status).toBe("fail")
            expect(res2.body.data.otp).toBe("Record don't exist")
            expect(res2.body.message).toBe("Please request a new code, you have exceed the limit of this code")


        })
    })
})
