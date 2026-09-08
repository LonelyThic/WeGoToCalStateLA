import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, it} from "vitest";
import {setupRedis} from "../../utils/containerSetup.mjs";
import {createRandomOtp} from "../../seed.mjs";
import {redisKeysConfig} from "../../../src/config/redisKeysConfig.mjs";
import {buildRedisKey} from "../../../src/util/redisKeyBuilder.mjs";
import Redis from "ioredis";
import {redisConfig} from "../../../src/config/redisConfig.mjs";
import {ServiceUnavailable} from "../../../src/errors/serviceUnavailable.mjs";
import {UnauthorizedError} from "../../../src/errors/unauthorizedError.mjs";
import {createSignupTokenStore} from "../../../src/repositories/redis/signupTokenStore.mjs";
import {faker} from "@faker-js/faker";
import {generateKey} from "../../../src/util/keyGenerator.mjs";

describe("signupTokenStore Integration", () => {
    let signupTokenStore
    let redis
    let count = 10
    let connectionURL
    let opt = {
        ttl: 300
    }

    const dbIndex = Number(process.env.VITEST_POOL_ID)
    const redisOption = {...redisConfig.option, db:dbIndex}
    beforeEach(() => {
        const redisUrl = process.env.REDIS_URL
        if (!redisUrl) throw new Error("REDIS_URL missing (ioredis would fallback to 127.0.0.1:6379)")
        redis = new Redis(redisUrl, redisOption)
        signupTokenStore = createSignupTokenStore({redis, signupTokenPrefix: redisKeysConfig.signupToken, opt})
    })
    afterAll(async ()=> {
        if(redis.status === 'end') return
        await redis.quit()
    })
    afterEach(async () => {
        if(redis.status === 'end') return
        await redis.flushdb();
    })


    describe("signupTokenStore .save", () => {
        it("save the signupToken", async () => {
            for(let i = 0; i < count; i++){
                const email = faker.internet.email()
                const verifiedMethod = "otp"
                const key = generateKey(32)
                await signupTokenStore.save(key, {email, verifiedMethod})
                const prefixKey = buildRedisKey(redisKeysConfig.signupToken, key)
                const verify = await redis.hgetall(prefixKey)
                const seconds = await redis.ttl(prefixKey);
                expect(verify.email).toBe(email)
                expect(verify.verifiedMethod).toBe(verifiedMethod)
                expect(verify).toHaveProperty("createdAt")
                expect(seconds).toBeLessThanOrEqual(opt.ttl)
            }

        })
        it("throws ServiceUnavailable when redis is down", async () => {
            await redis.quit()
            const key = generateKey(32)
            const email = faker.internet.email()
            const verifiedMethod = "otp"
            await expect(signupTokenStore.save(key, {
                email, verifiedMethod
            })).rejects.toBeInstanceOf(ServiceUnavailable)

            await expect(signupTokenStore.save(key, {
                email, verifiedMethod
            })).rejects.toThrow("Signup service is temporarily unavailable. Please try again later.");
        })
    })
    describe("signupTokenStore.consume", () => {
        it("return the signupToken", async () => {
            for(let i = 0; i < count; i++){
                const key = generateKey(32)
                const email = faker.internet.email()
                const verifiedMethod = "otp"
                await signupTokenStore.save(key, {
                    email, verifiedMethod
                })
                const verify = await signupTokenStore.consume(key)
                expect(verify.email).toBe(email)
                expect(verify.verifiedMethod).toBe(verifiedMethod)
                expect(verify).toHaveProperty("createdAt")
                expect(await signupTokenStore.consume(key)).toEqual({})

            }
        })

        it("throws ServiceUnavailable when redis is down", async () => {
            const key = generateKey(32)
            const email = faker.internet.email()
            const verifiedMethod = "otp"
            await signupTokenStore.save(key, {
                email, verifiedMethod
            })
            await redis.quit()
            await expect(signupTokenStore.consume(key)).rejects.toBeInstanceOf(ServiceUnavailable)
            await expect(signupTokenStore.consume(key))
                .rejects.toThrow("Signup service is temporarily unavailable. Please try again later.");
        })


    })



    afterEach(async () => {
        if(redis.status === 'end') return
        await redis.flushdb();
    })




})
