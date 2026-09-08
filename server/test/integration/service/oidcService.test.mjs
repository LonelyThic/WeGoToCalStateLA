import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi} from "vitest";
import {createJWTTokenService} from "../../../src/services/auth/jwt/jwtTokenService.mjs";
import {setupRedis} from "../../utils/containerSetup.mjs";
import Redis from "ioredis";
import {redisConfig} from "../../../src/config/redisConfig.mjs";
import {redisKeysConfig} from "../../../src/config/redisKeysConfig.mjs";
import {createOIDCStore} from "../../../src/repositories/redis/oidcStore.mjs";
import {createOIDCService} from "../../../src/services/auth/oidc/oidcService.mjs";
import {openIdClient} from "../../../src/lib/openIdClient.mjs";
import {openIdConfig} from "../../../src/config/openIdConfig.mjs";
import * as client from "openid-client";
import {faker} from "@faker-js/faker";
import {ServiceUnavailable} from "../../../src/errors/serviceUnavailable.mjs";
import {UnauthorizedError} from "../../../src/errors/unauthorizedError.mjs";

describe("oidcTokenStore Integration", () => {
    let oidcStore
    let oidcService
    let jwtTokenService = createJWTTokenService()
    let redis
    const dbIndex = Number(process.env.VITEST_POOL_ID)
    const redisOption = {...redisConfig.option, db:dbIndex}
    beforeEach(() => {
        const redisUrl = process.env.REDIS_URL
        if (!redisUrl) throw new Error("REDIS_URL missing (ioredis would fallback to 127.0.0.1:6379)")
        redis = new Redis(redisUrl, redisOption)
        oidcStore = createOIDCStore({redis, oidcPrefix: redisKeysConfig.oidc})
        oidcService = createOIDCService({
            oidcStore,
            jwtTokenService,
            openIdClient: openIdClient.googleClient,
            openIdConfig,
            provider: "google"
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
    describe("oidcService.startOIDCSignup", () => {
        it("return the token and url without the error", async () => {
            const {token, redirectURL} = await oidcService.startOIDCSignup()
            expect(token).not.toBeNull()
            expect(redirectURL).not.toBeNull()
        })
        it("thrown the ServiceUnavaliable due to redis down", async () => {
            await redis.quit()
            await expect(oidcService.startOIDCSignup()).rejects.toBeInstanceOf(ServiceUnavailable)
        })
    })
    describe("oidcService.completeOIDCSignup", () => {
        it("complete signup and return email", async () => {
            const email = faker.internet.email()
            vi.mock('openid-client', async (importOriginal) => {
                const actual = await importOriginal();
                return {
                    ...actual,
                    authorizationCodeGrant: vi.fn(),
                };
            });
            client.authorizationCodeGrant.mockResolvedValue({
                claims: () => ({email: email})
            })
            const {key, redirectURL} = await oidcService.startOIDCSignup()
            const verify = await oidcService.completeOIDCSignup(key, redirectURL)
            expect(email).toBe(verify)
        })
        it("thrown the ServiceUnavaliable due to redis down", async () => {
            const {key, redirectURL} = await oidcService.startOIDCSignup()
            await redis.quit()
            await expect(oidcService.completeOIDCSignup(key, redirectURL)).rejects.toBeInstanceOf(ServiceUnavailable)
        })
        it("thrown the Unauthorized due to empty key", async () => {
            await expect(oidcService.completeOIDCSignup("something", "something")).rejects.toBeInstanceOf(UnauthorizedError)
        })
    })
})
