import {afterEach, beforeAll, beforeEach, describe, expect, it, vi, afterAll} from "vitest";
import Redis from "ioredis";
import {redisConfig} from "../../../src/config/redisConfig.mjs";
import {createApp} from "../../../src/app/app.mjs";
import request, {cookies} from "supertest";
import {faker} from "@faker-js/faker";
import {createUserRepo} from "../../../src/repositories/userRepository.mjs";
import dbMapper from "../../../src/util/dbMapper.mjs";
import {createPool} from "mysql2/promise";

describe("signupRoute", () => {
    let redis
    let sqlPool
    let lastOtp = null;
    const emailService = {
        sendOTPEmail: vi.fn(async (_email, otpCode) => {
            lastOtp = otpCode;
        }),
    };
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
    afterEach(async () => {
        await connection.rollback()
        connection.release()
        if(redis.status === 'end') return
        await redis.flushdb();
        await redis.quit()
    })
    afterAll(async () => {
        await sqlPool.end()
    })
    describe("/api/auth/signup", () => {
        it("returns 200 and created the user", async () => {
            //get otp first
            const email = faker.internet.email()
            const password = "Wegoapp123456!"
            const res1 = await agent
                .post("/api/auth/otp/send")
                .send({ email})
                .expect('Content-Type', /json/)
                .expect(200)
            //verify the otp
            const res2 = await agent
                .post("/api/auth/otp/verify")
                .send({otp: lastOtp})
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(cookies.set({name: "signup_tx", options: ["path", "httponly", "samesite"]}))
            const userRepo= createUserRepo(connection)
            const userCount = await userRepo.getCount()
            const res3 = await agent
                .post("/api/auth/signup")
                .send({password})
                .expect('Content-Type', /json/)
                .expect(200)
            expect(await userRepo.getCount()).toBe(userCount + 1)
            expect(dbMapper.fromDb(await userRepo.findByUuid(res3.body.data.userUuid)).userUuid).toBe(res3.body.data.userUuid)

        })

        it("return 400 and validation error when password don't match the format", async () => {
            const email = faker.internet.email()
            const password = "Wegoapp123456"
            const res1 = await agent
                .post("/api/auth/otp/send")
                .send({ email})
                .expect('Content-Type', /json/)
                .expect(200)
            //verify the otp
            const res2 = await agent
                .post("/api/auth/otp/verify")
                .send({otp: lastOtp})
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(cookies.set({name: "signup_tx", options: ["path", "httponly", "samesite"]}))
            const res3 = await agent
                .post("/api/auth/signup")
                .send({password})
                .expect('Content-Type', /json/)
                .expect(400)
            expect(res3.body.status).toBe("fail")
            expect(res3.body.data).toHaveProperty("password")

        })
        it("return 400 and validation error when extra field is there", async () => {
            const email = faker.internet.email()
            const password = "Wegoapp123456!"
            const res1 = await agent
                .post("/api/auth/otp/send")
                .send({ email})
                .expect('Content-Type', /json/)
                .expect(200)
            //verify the otp
            const res2 = await agent
                .post("/api/auth/otp/verify")
                .send({otp: lastOtp})
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(cookies.set({name: "signup_tx", options: ["path", "httponly", "samesite"]}))
            const res3 = await agent
                .post("/api/auth/signup")
                .send({password, something: "a"})
                .expect('Content-Type', /json/)
                .expect(400)

        })
        it("return 401 due to no required cookie", async () => {
            const email = faker.internet.email()
            const password = "Wegoapp123456!"

            const res3 = await agent
                .post("/api/auth/signup")
                .send({password})
                .expect('Content-Type', /json/)
                .expect(401)
            expect(res3.body.status).toBe("fail")
            expect(res3.body.data).toHaveProperty("signup_tx")
        })

        it("return 503 and due to redis down", async () => {
            const email = faker.internet.email()
            const password = "Wegoapp123456!"
            const res1 = await agent
                .post("/api/auth/otp/send")
                .send({ email})
                .expect('Content-Type', /json/)
                .expect(200)
            //verify the otp
            const res2 = await agent
                .post("/api/auth/otp/verify")
                .send({otp: lastOtp})
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(cookies.set({name: "signup_tx", options: ["path", "httponly", "samesite"]}))
            const userRepo= createUserRepo(connection)
            const userCount = await userRepo.getCount()
            await redis.quit()
            const res3 = await agent
                .post("/api/auth/signup")
                .send({password})
                .expect('Content-Type', /json/)
                .expect(503)
            expect(res3.body.status).toBe("fail")

        })
    })
})
