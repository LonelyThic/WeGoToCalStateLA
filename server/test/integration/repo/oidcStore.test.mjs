import {afterEach, beforeAll, beforeEach, describe, expect, it, afterAll} from "vitest";
import Redis from "ioredis";
import {redisConfig} from "../../../src/config/redisConfig.mjs";
import {redisKeysConfig} from "../../../src/config/redisKeysConfig.mjs";
import {generateKey} from "../../../src/util/keyGenerator.mjs";
import {buildRedisKey} from "../../../src/util/redisKeyBuilder.mjs";
import {ServiceUnavailable} from "../../../src/errors/serviceUnavailable.mjs";
import {UnauthorizedError} from "../../../src/errors/unauthorizedError.mjs";
import {createRandomOidc} from "../../seed.mjs";
import {createOIDCStore} from "../../../src/repositories/redis/oidcStore.mjs";

describe("oidcStore Integration", () => {
    let oidcStore
    let redis
    let opt = {
        ttl: 300
    }
    let count = 10

    const dbIndex = Number(process.env.VITEST_POOL_ID)
    const redisOption = {...redisConfig.option, db:dbIndex}
    beforeEach(() => {
        const redisUrl = process.env.REDIS_URL
        if (!redisUrl) throw new Error("REDIS_URL missing (ioredis would fallback to 127.0.0.1:6379)")
        redis = new Redis(redisUrl, redisOption)
        oidcStore = createOIDCStore({redis, oidcPrefix: redisKeysConfig.oidc})
    })
    afterAll(async ()=> {
        if(redis.status === 'end') return
        await redis.quit()
    })
    afterEach(async () => {
        if(redis.status === 'end') return
        await redis.flushdb();
    })

    describe("oidcStore.save", () => {
        it("save the oidc", async () => {
            for(let i = 0; i < count; i++){
                const {provider, codeVerifier, codeChallenge, nonce, state} = await createRandomOidc("google")
                const key = generateKey(32)
                await oidcStore.save(key, {provider, codeVerifier, nonce, state})
                const prefixKey = buildRedisKey(redisKeysConfig.oidc, key)
                const verify = await redis.hgetall(prefixKey)
                const seconds = await redis.ttl(prefixKey);
                expect(verify.provider).toBe(provider)
                expect(verify.codeVerifier).toBe(codeVerifier)
                expect(verify.nonce).toBe(nonce)
                expect(verify.state).toBe(state)
                expect(verify).toHaveProperty("createdAt")
                expect(seconds).toBeLessThanOrEqual(opt.ttl)
            }

        })
        it("throws ServiceUnavailable when redis is down", async () => {
            await redis.quit()
            const {provider, codeVerifier, codeChallenge, nonce, state} = await createRandomOidc("google")
            const key = generateKey(32)
            await expect(oidcStore.save(key,{provider, codeVerifier, nonce, state})).rejects.toBeInstanceOf(ServiceUnavailable)
            await expect(oidcStore.save(key, {provider, codeVerifier, nonce, state})).rejects.toThrow("Signup service is temporarily unavailable. Please try again later.");
        })
    })
    describe("oidcStore.consume", () => {
        it("return the oidcStore", async () => {
            for(let i = 0; i < count; i++){
                const {provider, codeVerifier, codeChallenge, nonce, state} = await createRandomOidc("google")
                const key = generateKey(32)
                await oidcStore.save(key, {provider, codeVerifier, nonce, state})
                const verify = await oidcStore.consume(key)
                expect(verify.provider).toBe(provider)
                expect(verify.codeVerifier).toBe(codeVerifier)
                expect(verify.nonce).toBe(nonce)
                expect(verify.state).toBe(state)
                expect(verify).toHaveProperty("createdAt")
                const deleteFun = await oidcStore.consume(key)
                expect(deleteFun).toEqual({})
            }
        })

        it("throws ServiceUnavailable when redis is down", async () => {
            await redis.quit()
            const {provider, codeVerifier, codeChallenge, nonce, state} = await createRandomOidc("google")
            const key = generateKey(32)
            await expect(oidcStore.consume(key,{provider, codeVerifier, nonce, state})).rejects.toBeInstanceOf(ServiceUnavailable)
            await expect(oidcStore.consume(key, {provider, codeVerifier, nonce, state})).rejects.toThrow("Signup service is temporarily unavailable. Please try again later.");
        })

    })
})
