import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, it} from "vitest";
import Redis from "ioredis";
import {redisConfig} from "../../../src/config/redisConfig.mjs";
import {createSignupTokenStore} from "../../../src/repositories/redis/signupTokenStore.mjs";
import {redisKeysConfig} from "../../../src/config/redisKeysConfig.mjs";
import {createJWTTokenService} from "../../../src/services/auth/jwt/jwtTokenService.mjs";
import {faker} from "@faker-js/faker";
import {createSignupTokenService} from "../../../src/services/auth/signup/signupTokenService.mjs";
import {UnauthorizedError} from "../../../src/errors/unauthorizedError.mjs";

describe("signupTokenService Integration", () => {
    let signupTokenStore
    let signupTokenService
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
        signupTokenStore = createSignupTokenStore({redis, signupTokenPrefix: redisKeysConfig.signupToken})
        signupTokenService = createSignupTokenService({
            signupTokenStore,
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
    describe("signupTokenService.saveSignupToken", () => {
        it("save the signupToken", async () => {
            for(let i = 0; i < count; i++){
                const email = faker.internet.email()
                const verifiedMethod = "otp"
                const {key, token} = await signupTokenService.saveSignupToken(email, verifiedMethod)
                const val = await signupTokenStore.consume(key)

                expect(val).not.toBeNull()
                expect(val.email).toBe(email)
                expect(val.verifiedMethod).toBe(verifiedMethod)
                expect(val.createdAt).not.toBeNull()
            }

        })
    })
    describe("signupTokenService.verifySignupToken", () => {
        it("verify the signupToken", async () => {
            const email = faker.internet.email()
            const verifiedMethod = "otp"
            const {key, token} = await signupTokenService.saveSignupToken(email,verifiedMethod)
            const email2 = await signupTokenService.verifySignupToken(key)
            expect(email).toBe(email2)

        })

        it("throw unauthorized error due not found", async () => {
            await expect(signupTokenService.verifySignupToken("coolkey")).rejects.toBeInstanceOf(UnauthorizedError)
        })

    })
})
