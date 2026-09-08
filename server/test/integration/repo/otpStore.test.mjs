import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, it} from "vitest";
import {setupRedis} from "../../utils/containerSetup.mjs";
import {createRandomOtp} from "../../seed.mjs";
import {createOTPStore} from "../../../src/repositories/redis/otpStore.mjs";
import {redisKeysConfig} from "../../../src/config/redisKeysConfig.mjs";
import {buildRedisKey} from "../../../src/util/redisKeyBuilder.mjs";
import Redis from "ioredis";
import {redisConfig} from "../../../src/config/redisConfig.mjs";
import {ServiceUnavailable} from "../../../src/errors/serviceUnavailable.mjs";
import {UnauthorizedError} from "../../../src/errors/unauthorizedError.mjs";

describe("otpStore Integration", () => {
    let otpStore
    let redis
    let count = 10
    let opt = {
        ttl: 300
    }
    const dbIndex = Number(process.env.VITEST_POOL_ID)
    const redisOption = {...redisConfig.option, db:dbIndex}
    beforeEach(() => {
        const redisUrl = process.env.REDIS_URL
        if (!redisUrl) throw new Error("REDIS_URL missing (ioredis would fallback to 127.0.0.1:6379)")
        redis = new Redis(redisUrl, redisOption)
        otpStore = createOTPStore({redis, otpPrefix: redisKeysConfig.otp})
    })
    afterEach(async () => {
        if(redis.status === 'end') return
        await redis.flushdb();
    })
    afterAll(async ()=> {
        if(redis.status === 'end') return
        await redis.quit()
    })
    afterEach(async () => {
        if(redis.status === 'end') return
        await redis.flushdb();
    })


    describe("otpStore.save", () => {
        it("save the otp", async () => {
           for(let i = 0; i < count; i++){
               const {key, otpVal} = await createRandomOtp()
               await otpStore.save(key, otpVal)
               const prefixKey = buildRedisKey(redisKeysConfig.otp, key)
               const verify = await redis.hgetall(prefixKey)
               const seconds = await redis.ttl(prefixKey);
               expect(verify.email).toBe(otpVal.email)
               expect(verify.otpCodeHash).toBe(otpVal.otpCodeHash)
               expect(verify.attempts).toBe("0")
               expect(verify.createdAt).not.toBeNull()
               expect(seconds).toBeLessThanOrEqual(opt.ttl)
           }

        })
        it("throws ServiceUnavailable when redis is down", async () => {
            await redis.quit()
            const {key, otpVal} = await createRandomOtp()
            await expect(otpStore.save(key, otpVal)).rejects.toBeInstanceOf(ServiceUnavailable)
            await expect(otpStore.save(key, otpVal))
                .rejects.toThrow("Signup service is temporarily unavailable. Please try again later.");
        })
    })
    describe("otpStore.consume", () => {
        it("return the otpVal", async () => {
            for(let i = 0; i < count; i++){
                const {key, otpVal} = await createRandomOtp()
                await otpStore.save(key, otpVal)
                const verify = await otpStore.consume(key)
                expect(verify.email).toBe(otpVal.email)
                expect(verify.otpCodeHash).toBe(otpVal.otpCodeHash)
                expect(verify.attempts).toBe("0")
                expect(verify).toHaveProperty("createdAt")
            }
        })
        it("throws ServiceUnavailable when redis is down", async () => {
            const {key, otpVal} = await createRandomOtp()
            await otpStore.save(key, otpVal)
            await redis.quit()
            await expect(otpStore.consume(key)).rejects.toBeInstanceOf(ServiceUnavailable)
            await expect(otpStore.consume(key))
                .rejects.toThrow("Signup service is temporarily unavailable. Please try again later.");
        })

    })
    describe("otpStore.incrementAttempts", () => {
        it("increment the attempts of the key", async () => {
            const {key, otpVal} = await createRandomOtp()
            await otpStore.save(key, otpVal)
            for(let i = 0; i < 10; i++){
                const{attempts} = await otpStore.consume(key)
                expect(attempts).toBe(i.toString())
                await otpStore.incrementAttempts(key)
            }
        })
        it("throws ServiceUnavailable when redis is down", async () => {
            const {key, otpVal} = await createRandomOtp()
            await otpStore.save(key, otpVal)
            await redis.quit()
            await expect(otpStore.incrementAttempts(key)).rejects.toBeInstanceOf(ServiceUnavailable)
        })
    })
    describe("otpStore.deleteOTP", () => {
        it("delete the key", async () => {
            for(let i = 0; i < count; i++){
                const {key, otpVal} = await createRandomOtp()
                await otpStore.save(key, otpVal)
                const verify = await otpStore.consume(key)
                expect(verify.email).toBe(otpVal.email)
                expect(verify.otpCodeHash).toBe(otpVal.otpCodeHash)
                expect(verify.attempts).toBe("0")
                expect(verify).toHaveProperty("createdAt")
                await otpStore.deleteOTP(key)
                const verify2 = await otpStore.consume(key)
                expect(verify2).toEqual({})
            }
        })
    })
})
