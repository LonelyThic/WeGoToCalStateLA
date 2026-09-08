import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi} from "vitest";
import Redis from "ioredis";
import {redisConfig} from "../../../src/config/redisConfig.mjs";
import {createApp} from "../../../src/app/app.mjs";
import request, {cookies} from "supertest";
import {faker} from "@faker-js/faker";
import * as client from "openid-client";
import {createPool} from "mysql2/promise";
vi.mock('openid-client', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        authorizationCodeGrant: vi.fn(),
    };
});
describe("googleAuthRoute Integration", () => {
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
        redis = new Redis(process.env.REDIS_URL, redisOption)
        emailService.sendOTPEmail.mockClear()
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

    describe("googleAuthRoute Integration", () => {
        describe("GET /api/auth/google", () => {
            it("redirect user and set the cookie", async () => {
                const res = await agent
                    .get("/api/auth/google")
                    .expect(302)
                    .expect(cookies.set({ name: "oidc_tx", options: ["path", "httponly", "samesite"] }))
            })
            it("return 503 due to redis down", async () => {
                await redis.quit()
                const res = await agent
                    .get("/api/auth/google")
                    .expect(503)
                    .expect(cookies.not("set", {name: "oidc_tx", options: ["path", "httponly", "samesite"]}))
            })
        })
        describe("GET /api/auth/google/callback", () => {
            it("success and set the cookie signup_tx", async () => {
                const email = faker.internet.email()

                client.authorizationCodeGrant.mockResolvedValue({
                    claims: () => ({email: email})
                })
                const res = await agent
                    .get("/api/auth/google")
                    .expect(302)
                    .expect(cookies.set({ name: "oidc_tx", options: ["path", "httponly", "samesite"] }))
                const res2 = await agent
                    .get("/api/auth/google/callback")
                    .expect(200)
                    .expect(cookies.set({ name: "signup_tx", options: ["path", "httponly", "samesite"] }))
            })
            it("return 401 due to no set cookie", async () => {

                const res2 = await agent
                    .get("/api/auth/google/callback")
                    .expect(401)
                    .expect(cookies.not("set", {name: "signup_tx", options: ["path", "httponly", "samesite"] }))
            })
            it("return 503 due to redis down", async () => {
                const res = await agent
                    .get("/api/auth/google")
                    .expect(302)
                    .expect(cookies.set({ name: "oidc_tx", options: ["path", "httponly", "samesite"] }))
                await redis.quit()
                const res2 = await agent
                    .get("/api/auth/google/callback")
                    .expect(503)
                    .expect(cookies.not("set", {name: "signup_tx", options: ["path", "httponly", "samesite"] }))
            })
            it("return 401 due to oidcToken not found in redis", async () => {
                const res = await agent
                    .get("/api/auth/google")
                    .expect(302)
                    .expect(cookies.set({name: "oidc_tx", options: ["path", "httponly", "samesite"]}))
                await redis.flushdb()
                const res2 = await agent
                    .get("/api/auth/google/callback")
                    .expect(401)
                    .expect(cookies.not("set", {name: "signup_tx", options: ["path", "httponly", "samesite"]}))
            })
            it("return 400 badRequest due to invalid googleAuth", async () => {
                const res = await agent
                    .get("/api/auth/google")
                    .expect(302)
                    .expect(cookies.set({ name: "oidc_tx", options: ["path", "httponly", "samesite"] }))
                client.authorizationCodeGrant.mockRejectedValueOnce(new Error("invalid_grant"))
                const res2 = await agent
                    .get("/api/auth/google/callback")
                    .expect(400)
                    .expect(cookies.not("set", {name: "signup_tx", options: ["path", "httponly", "samesite"]}))
            })
        })
    })

})
