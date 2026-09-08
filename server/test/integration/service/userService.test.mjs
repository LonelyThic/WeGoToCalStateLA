import { describe, it, expect,afterEach, beforeAll,afterAll, beforeEach} from 'vitest'
import { createUserService } from '../../../src/services/users/userService.mjs'
import { createUsernameService } from '../../../src/services/users/usernameGenerator.mjs'
import { createUserRepo } from '../../../src/repositories/userRepository.mjs'
import dbMapper from '../../../src/util/dbMapper.mjs'
import { NotFoundError } from '../../../src/errors/notFoundError.mjs'
import {createRandomUser, seedUsers} from "../../seed.mjs";
import {createPool} from "mysql2/promise";

describe("userService Integration", () => {
    let connectionPool
    let userRepo
    let users
    let userService
    let usernameService
    let connection
    beforeAll(async () => {
        connectionPool = createPool(process.env.DATABASE_URL)
        users = global.users
    } )

    beforeEach(async () => {
        connection = await connectionPool.getConnection()
        userRepo = createUserRepo(connection)
        usernameService = createUsernameService(userRepo)
        userService = createUserService({userRepo, usernameService})
        await connection.beginTransaction()

    })

    afterEach(async () => {
        await connection.rollback()
        connection.release()
    })

    afterAll(async () => {
        await connectionPool.end()
    })

    describe("userService Integration", () => {
        describe("userService.getUserCount", async () => {
            it("return the correct user count", async () => {
                const count = await userService.getUserCount()
                expect(count).toBe(users.length)
            })
        })
        describe("userService.getUser", () => {
            it.each([
                {name: "getByUserId", call: async (user) => await userService.getByUserId(user.userId)},
                {name: "getByUsername", call: async (user) => await userService.getByUsername(user.username)},
                {name: "getByEmailHash", call: async (user) => await userService.getByEmailHash(user.emailHash)},
                {name: "getByUuid", call: async (user) => await userService.getByUuid(user.userUuid)}
            ])("$name: get the user", async ({call}) =>{
                for(let i = 0; i < users.length; i++){
                    const user = users[i]
                    const verify = await call(user)
                    expect(user.userId).toBe(verify.userId)
                    expect(user.userUuid).toBe(verify.userUuid)
                    expect(user.username).toBe(verify.username)
                    expect(user.emailHash).toEqual(verify.emailHash)
                }
            })

            it.each([
                {name: "getByUserId", call: async (user) => await userService.getByUserId(user.userId)},
                {name: "getByUsername", call: async (user) => await userService.getByUsername(user.username)},
                {name: "getByEmailHash", call: async (user) => await userService.getByEmailHash(user.emailHash)},
                {name: "getByUuid", call: async (user) => await userService.getByUuid(user.userUuid)}
            ])("$name: throw the not found error", async ({call}) =>{
                for (let i = 0; i < users.length; i++) {
                    const temp= await createRandomUser()
                    const user = {...temp, userId: 10000}
                    const errFun = call(user)
                    await expect(errFun).rejects.toBeInstanceOf(NotFoundError)
                    await expect(errFun).rejects.toThrow("Can not found the user")
                }
            })

        })

        describe("userService.deleteByUserId", () => {
            it.each([
                {name: "deleteByUserId", call: async (user) => await userService.deleteByUserId(user.userId)},
                {name: "deleteByUserUuid", call: async (user) => await userService.deleteByUserUuid(user.userUuid)},
            ])("delete the existing user", async ({call}) => {
                for (let i = 0; i < users.length; i++) {
                    expect(await userService.getUserCount()).toBe(users.length - i)
                    const deleted = await call(users[i])
                    const user = await userRepo.findByUserId(users[i].userId)
                    expect(user).toBeNull()
                    //check soft delete or not
                    const [row] = await connection.query(
                        'select user_id, BIN_TO_UUID(user_uuid) as user_uuid,  email_hash, username, display_name, created_at, updated_at from users where user_id = ?',[users[i].userId]
                    )
                    const deleteUser = dbMapper.fromDb(row[0])

                    expect(deleteUser).not.toBeNull()
                    expect(deleteUser.username).toBeNull()
                    expect(deleteUser.displayName).toBeNull()
                    expect(deleteUser.emailHash).toBeNull()
                    expect(deleteUser.userId).not.toBeNull()
                    expect(deleteUser.userUuid).not.toBeNull()
                    expect(deleteUser.createdAt).not.toBeNull()
                    expect(deleteUser.updatedAt).not.toBeNull()
                    expect(deleteUser.deleteAt).not.toBeNull()
                }
            })
            it.each([
                {name: "deleteByUserId", call: async (user) => await userService.deleteByUserId(user.userId)},
                {name: "deleteByUserUuid", call: async (user) => await userService.deleteByUserUuid(user.userUuid)},
            ])("throw an NotFound Error", async ({call}) => {
                for (let i = 0; i < users.length; i++) {
                    const user = await createRandomUser()
                    const errFun = call(user)
                    await expect(errFun).rejects.toBeInstanceOf(NotFoundError)
                    await expect(errFun).rejects.toThrow("Can not found the user")

                }
            })
        })
        describe("userService.createUser", () => {
            it("create a new user", async () => {
                for(let i = 0; i < 10; i++){
                    expect(await userService.getUserCount()).toBe(users.length + i)
                    const seedUser = await createRandomUser()
                    const user = await userService.createUser({
                        emailHash: seedUser.emailHash,
                        passwordHash: seedUser.passwordHash
                    })
                    expect(user.emailHash).toEqual(seedUser.emailHash)
                }
            })
            it("soft delete a same emailHash user and create a new one", async () => {
                for(let i = 0; i < users.length; i++){
                    const user = await userService.createUser({
                        emailHash: users[i].emailHash,
                        passwordHash: users[i].passwordHash
                    })
                    expect(await userService.getUserCount()).toBe(users.length)
                    expect(user.emailHash).toEqual(users[i].emailHash)
                    expect(user.passwordHash).not.toBe(users[i].passwordHash)
                    expect(user.userId).not.toBe(users[i].userId)
                    expect(user.userUuid).not.toEqual(users[i].userUuid)
                    expect(user.username).not.toBe(users[i].username)
                }
            })
        })
        describe("userService.patch", () => {
            it.each([
                {name: "patchByUserId", call: async (user, data) => await userService.patchByUserId(user.userId, data)},
                {name: "patchByUserUuid", call: async (user, data) => await userService.patchByUserUuid(user.userUuid, data)},
            ])("$name patched user's field", async ({call}) => {
                for(let i = 0; i < users.length; i++){
                    const {username} = await createRandomUser()
                    const user = await call(users[i], {
                        displayName: username
                    })
                    expect(user.displayName).toBe(username)
                    expect(await userService.getUserCount()).toBe(users.length)
                }
            })
            it.each([
                {name: "patchByUserId", call: async (user, data) => await userService.patchByUserId(user.userId, data)},
                {name: "patchByUserUuid", call: async (user, data) => await userService.patchByUserUuid(user.userUuid, data)},
            ])("$name throw NotFoundError because user not found", async ({call}) => {
                for(let i = 0; i < users.length; i++){
                    const user = await createRandomUser()
                    const errFun = call(user, {
                        displayName: user.username
                    })
                    await expect(errFun).rejects.toBeInstanceOf(NotFoundError)
                    await expect(errFun).rejects.toThrow("Can not found current user")
                }
            })
        })
    })


})