import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, it} from "vitest";
import {createPool} from "mysql2/promise";
import {createRandomUser, seedUsers} from "../../seed.mjs";
import dbMapper from "../../../src/util/dbMapper.mjs";
import {createAuthRepo} from "../../../src/repositories/authRepository.mjs";
import {createUserRepo} from "../../../src/repositories/userRepository.mjs";

describe("authRepo Integration", () => {
    let connectionPool
    let authRepo
    let connection
    let users
    beforeAll(async () => {
        connectionPool = createPool(process.env.DATABASE_URL)
        users = global.users
    }, )

    beforeEach(async () => {
        connection = await connectionPool.getConnection()
        authRepo = createAuthRepo(connection)
        let userRepo = createUserRepo(connection)
        await connection.beginTransaction()
    })

    afterEach(async () => {
        await connection.rollback()
        connection.release()
    })

    afterAll(async() => {
        await connectionPool.end()
    })

   describe("userRepo.findUser", () => {
       it.each([
           {name: "findByEmailHash", call: async (user) => await authRepo.findByEmailHash(user.emailHash)},
           {name: "findByUsername", call: async (user) => await authRepo.findByUsername(user.username)},
       ])("$name: found the user", async ({call}) => {
           for (let i = 0; i < users.length; i++) {
               const user = users[i]
               const verify = dbMapper.fromDb(await call(user))
               expect(user.userId).toBe(verify.userId)
               expect(user.userUuid).toBe(verify.userUuid)
               expect(user.emailHash).toEqual(verify.emailHash)
           }
       })
       it.each([
           {name: "findByEmailHash", call: async (user) => await authRepo.findByEmailHash(user.emailHash)},
           {name: "findByUsername", call: async (user) => await authRepo.findByUsername(user.username)},
       ])("$name: did not found the user", async ({call}) => {
           for (let i = 0; i < users.length; i++) {
               const user = createRandomUser()
               const verify = dbMapper.fromDb(await call(user))
               expect(verify).toBeNull()
           }
       })
   })
})
