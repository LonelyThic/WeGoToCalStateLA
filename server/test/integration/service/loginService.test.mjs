import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, it} from "vitest";
import {createJWTTokenService} from "../../../src/services/auth/jwt/jwtTokenService.mjs";
import {redisConfig} from "../../../src/config/redisConfig.mjs";
import {createPasswordService} from "../../../src/services/users/passwordService.mjs";
import Redis from "ioredis";
import {createRandomUser, seedUsers} from "../../seed.mjs";
import {createUserRepo} from "../../../src/repositories/userRepository.mjs";
import {createPool} from "mysql2/promise";
import {createAuthRepo} from "../../../src/repositories/authRepository.mjs";
import {createLoginService} from "../../../src/services/auth/login/loginService.mjs";
import {NotFoundError} from "../../../src/errors/notFoundError.mjs";

describe("Login Service Integration", () => {
    let jwtTokenService= createJWTTokenService()
    let passwordService = createPasswordService()
    let redis
    let connectionPool
    let connection
    let users
    let userRepo
    let authRepo
    let loginService
    let count = 10
    const dbIndex = Number(process.env.VITEST_POOL_ID)
    const redisOption = {...redisConfig.option, db:dbIndex}
    beforeAll(async () => {
        connectionPool = createPool(process.env.DATABASE_URL)
        users = global.users
    }, )
    beforeEach(async () => {
        const redisUrl = process.env.REDIS_URL
        if (!redisUrl) throw new Error("REDIS_URL missing (ioredis would fallback to 127.0.0.1:6379)")
        redis = new Redis(redisUrl, redisOption)
        connection = await connectionPool.getConnection()
        await connection.beginTransaction()
        userRepo = createUserRepo(connection)
        authRepo = createAuthRepo(connection)
        loginService = createLoginService({authRepo, jwtTokenService, passwordService})
    })
    afterAll(async ()=> {
        if(redis.status === 'end') return
        await redis.quit()
    })
    afterEach(async () => {
        await connection.rollback()
        connection.release()
        if(redis.status === 'end') return
        await redis.flushdb();
    })
    describe("loginService.saveSignupToken", () => {
        it("login user and get the token", async () => {
            for(let i = 0; i < count; i++){
                const token = await loginService.loginUser(users[i].emailHash, users[i].password)
                expect(token).not.toBeNull()
            }
        })
        it("throw NotFound error when use wrong emailHash", async () => {
            const user = await createRandomUser()
            await expect(loginService.loginUser(user.emailHash, user.password)).rejects.toBeInstanceOf(NotFoundError)
        })
        it("throw unauthorizedError due to unmatch password", async () =>{
            const user = await createRandomUser();
            await expect(loginService.loginUser(users[0].emailHash, user.passwordHash))
        })

    })

})
