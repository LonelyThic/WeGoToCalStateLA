import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, it} from "vitest";
import {createJWTTokenService} from "../../../src/services/auth/jwt/jwtTokenService.mjs";
import {createLoginTokenStore} from "../../../src/repositories/redis/loginTokenStore.mjs";
import {redisConfig} from "../../../src/config/redisConfig.mjs";
import {createLoginTokenService} from "../../../src/services/auth/login/loginTokenService.mjs";
import Redis from "ioredis";
import {redisKeysConfig} from "../../../src/config/redisKeysConfig.mjs";
import {UnauthorizedError} from "../../../src/errors/unauthorizedError.mjs";

describe("loginToken Integration", () => {
    let loginTokenStore
    let loginTokenService
    let jwtTokenService= createJWTTokenService()
    let redis
    let count = 10
    let round = 10
    let opt = {
        ttl: 300
    }
    const dbIndex = Number(process.env.VITEST_POOL_ID)
    const redisOption = {...redisConfig.option, db:dbIndex}
    beforeEach(() => {
        const redisUrl = process.env.REDIS_URL
        if (!redisUrl) throw new Error("REDIS_URL missing (ioredis would fallback to 127.0.0.1:6379)")
        redis = new Redis(redisUrl, redisOption)
        loginTokenStore = createLoginTokenStore({redis, loginTokenPrefix: redisKeysConfig.loginToken})
        loginTokenService= createLoginTokenService({
            loginTokenStore,
            jwtTokenService,
        })
    })
    afterAll(async ()=> {
        if(redis.status === 'end') return
        await redis.quit()
    })
    afterEach(async () => {
        if(redis.status === 'end') return
        await redis.flushdb();
    })
    describe("loginToken.saveLoginToken", () => {
        it("save the loginToken", async () => {
            for(let i = 0; i < count; i++){
                const {key, token} = await loginTokenService.saveLoginToken()
                const val = await loginTokenStore.consume(key)
                expect(val).not.toBeNull()
                expect(val).toHaveProperty("createdAt")
            }
        })
    })
    describe("loginToken.verifySignupToken", () => {
        it("verify the loginToken", async () => {
            const {key, token} = await loginTokenService.saveLoginToken()
            const loginVal = await loginTokenService.verifyLoginToken(key)
            expect(loginVal).toHaveProperty("createdAt")

        })

        it("throw unauthorized error due not found", async () => {
            await expect(loginTokenService.verifyLoginToken("coolkey")).rejects.toBeInstanceOf(UnauthorizedError)
        })

    })
})
