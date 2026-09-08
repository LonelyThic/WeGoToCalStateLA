import {afterAll, afterEach, beforeEach, describe, expect, it} from "vitest";
import {redisConfig} from "../../../src/config/redisConfig.mjs";
import Redis from "ioredis";
import {redisKeysConfig} from "../../../src/config/redisKeysConfig.mjs";
import {faker} from "@faker-js/faker";
import {generateKey} from "../../../src/util/keyGenerator.mjs";
import {buildRedisKey} from "../../../src/util/redisKeyBuilder.mjs";
import {ServiceUnavailable} from "../../../src/errors/serviceUnavailable.mjs";
import {createLoginTokenStore} from "../../../src/repositories/redis/loginTokenStore.mjs";

describe("LoginStore Integration", () => {
    let loginStore
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
        loginStore = createLoginTokenStore({redis, loginTokenPrefix: redisKeysConfig.loginToken, opt})
    })
    afterAll(async ()=> {
        if(redis.status === 'end') return
        await redis.quit()
    })
    afterEach(async () => {
        if(redis.status === 'end') return
        await redis.flushdb();
    })


    describe("loginStore.save", () => {
        it("save the loginToken", async () => {
            for(let i = 0; i < count; i++){
                const key = generateKey(32)
                await loginStore.save(key)
                const prefixKey = buildRedisKey(redisKeysConfig.loginToken, key)
                const verify = await redis.hgetall(prefixKey)
                const seconds = await redis.ttl(prefixKey);
                expect(verify).toHaveProperty("createdAt")
                expect(seconds).toBeLessThanOrEqual(opt.ttl)
            }

        })
        it("throws ServiceUnavailable when redis is down", async () => {
            await redis.quit()
            const key = generateKey(32)
            await expect(loginStore.save(key)).rejects.toBeInstanceOf(ServiceUnavailable)
        })
    })

    describe("loginStore.consume", () => {
        it("return the loginToken", async () => {
            for(let i = 0; i < count; i++){
                const key = generateKey(32)
                await loginStore.save(key)
                const verify = await loginStore.consume(key)
                expect(verify).toHaveProperty("createdAt")
                expect(await loginStore.consume(key)).toEqual({})

            }
        })

        it("throws ServiceUnavailable when redis is down", async () => {
            const key = generateKey(32)
            await loginStore.save(key)
            await redis.quit()
            await expect(loginStore.consume(key)).rejects.toBeInstanceOf(ServiceUnavailable)
        })


    })



    afterEach(async () => {
        if(redis.status === 'end') return
        await redis.flushdb();
    })




})
