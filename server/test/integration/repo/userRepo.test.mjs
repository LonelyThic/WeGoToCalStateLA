import {
    describe,
    it,
    expect,
    afterEach,
    beforeAll,
    beforeEach,
    afterAll
} from 'vitest'
import { createUserRepo } from '../../../src/repositories/userRepository.mjs'
import dbMapper from '../../../src/util/dbMapper.mjs'
import { createRandomUser, seedUsers } from '../../seed.mjs'
import { createPool} from "mysql2/promise";
import {faker} from "@faker-js/faker";



describe("userRepo Integration", () => {
    let connectionPool
    let userRepo
    let connection
    let users
    beforeAll(async () => {
        connectionPool = createPool(process.env.DATABASE_URL)
        users = global.users
    }, )

    beforeEach(async () => {
        connection = await connectionPool.getConnection()
        userRepo = createUserRepo(connection)
        await connection.beginTransaction()
    })

    afterEach(async () => {
        await connection.rollback()
        connection.release()
    })

    afterAll(async() => {
        await connectionPool.end()
    })


    describe("UserRepo.getCount", () => {
        it("return the correct count", async () => {
            expect(await userRepo.getCount()).toBe(users.length)
        })
    })

    describe("userRepo.findUser", () => {

        it.each([
            {name: "findByUserId", call: async (user) => await userRepo.findByUserId(user.userId)},
            {name: "findByUsername", call: async (user) => await userRepo.findByUsername(user.username)},
            {name: "findByEmailHash", call: async (user) => await userRepo.findByEmailHash(user.emailHash)},
            {name: "findByUuid", call: async (user) => await userRepo.findByUuid(user.userUuid)}
        ])("$name: found the user", async ({call}) =>{
            for(let i = 0; i < users.length; i++){
                const user = users[i]
                const verify = dbMapper.fromDb(await call(user))
                expect(user.userId).toBe(verify.userId)
                expect(user.userUuid).toBe(verify.userUuid)
                expect(user.username).toBe(verify.username)
                expect(user.emailHash).toEqual(verify.emailHash)
            }
        })
        it.each([
            {
                name: 'findByUserId',
                call: async (user) => await userRepo.findByUserId(user.userId),
            },
            {
                name: 'findByUsername',
                call: async (user) =>
                    await userRepo.findByUsername(user.username),
            },
            {
                name: 'findByEmailHash',
                call: async (user) =>
                    await userRepo.findByEmailHash(user.emailHash),
            },
            {
                name: 'findByUuid',
                call: async (user) => await userRepo.findByUuid(user.userUuid),
            },
        ])('$name: found the user', async ({ call }) => {
            for (let i = 0; i < users.length; i++) {
                const temp= await createRandomUser()
                const user = {...temp, userId: 10000}
                const verify = dbMapper.fromDb(await call(user))
                expect(verify).toBeNull()
            }
        })
    })

    describe("userRepo.insertUser", () => {
        it("create the user", async () => {
            for(let i = 0; i < 10; i++){
                const user = await createRandomUser()
                const insertId = await userRepo.insertUser(user)
                const verify = dbMapper.fromDb(await userRepo.findByUserId(insertId))
                expect(insertId).toBe(verify.userId)
                expect(user.username).toBe(verify.username)
                expect(user.userUuid).toBe(verify.userUuid)
                expect(user.emailHash).toEqual(verify.emailHash)
            }
        })
    })

    describe("userRepo.updateByUserId", () => {
        it("update the user", async () =>{
            const sqlQuery = 'Update users set display_name = ?'
            for(let i = 0; i < users.length; i++){
                const {existed, changed} = await userRepo.updateByUserId(users[i].userId, sqlQuery, ["new name"])
                expect(existed).toBeTruthy()
                expect(changed).toBeTruthy()
                const user = dbMapper.fromDb(await userRepo.findByUserId(users[i].userId))
                expect(user).not.toBeNull()
                expect(user.displayName).toBe("new name")
                expect(user.userId).toBe(users[i].userId)
                expect(user.userUuid).toBe(users[i].userUuid)
                expect(user.username).toBe(users[i].username)
                expect(user.emailHash).toEqual(users[i].emailHash)
            }
        })

        it("did not update user due to non existence" ,async () => {
            const sqlQuery = 'Update users set display_name = ?'
            for(let i = 0; i < users.length; i++){
                const {existed, changed} = await userRepo.updateByUserId(users[i].userId + 100000, sqlQuery, ["new name"])
                expect(existed).toBeFalsy()
                expect(changed).toBeFalsy()
            }
            expect(await userRepo.getCount()).toBe(users.length)
            for(let i = 0; i< users.length; i++){
                const user = await userRepo.findByUserId(users[i].userId)
                expect(user.displayName).not.toBeNull()
                expect(user.displayName).not.toBe(users[i].displayName)
            }
        })
    })

    describe("userRepo.updateByUserUuid", () => {
        it("update the user", async () =>{
            const sqlQuery = 'Update users set display_name = ?'
            for(let i = 0; i < users.length; i++){
                const {existed, changed} = await userRepo.updateByUserUuid(users[i].userUuid, sqlQuery, ["new name"])
                expect(existed).toBeTruthy()
                expect(changed).toBeTruthy()
                const user = dbMapper.fromDb(await userRepo.findByUserId(users[i].userId))
                expect(user).not.toBeNull()
                expect(user.displayName).toBe("new name")
                expect(user.userId).toBe(users[i].userId)
                expect(user.userUuid).toBe(users[i].userUuid)
                expect(user.username).toBe(users[i].username)
                expect(user.emailHash).toEqual(users[i].emailHash)
            }
        })
        it("did not update user due to non existence" ,async () => {
            const sqlQuery = 'Update users set display_name = ?'
            for(let i = 0; i < users.length; i++){
                const uuid = faker.string.uuid()
                const {existed, changed} = await userRepo.updateByUserUuid(uuid , sqlQuery, ["new name"])
                expect(existed).toBeFalsy()
                expect(changed).toBeFalsy()
            }
            expect(await userRepo.getCount()).toBe(users.length)
            for(let i = 0; i< users.length; i++){
                const user = await userRepo.findByUserId(users[i].userId)
                expect(user.displayName).not.toBeNull()
                expect(user.displayName).not.toBe(users[i].displayName)
            }
        })
    })
    describe("userRepo.DeleteUser", () => {
        it.each([
            {
                name: 'deleteByUserId',
                call: async (user) => await userRepo.deleteByUserId(user.userId),
            },
            {
                name: 'deleteByEmailHash',
                call: async (user) =>
                    await userRepo.deleteByEmailHash(user.emailHash),
            },
            {
                name: "deleteByUserUuid",
                call: async (user) =>
                    await userRepo.deleteByUserUuid(user.userUuid)

            }

        ])('$name: delete the user', async ({ call }) => {
            for (let i = 0; i < users.length; i++) {
                expect(await userRepo.getCount()).toBe(users.length - i)
                const deleted = await call(users[i])
                expect(deleted).toBeTruthy()
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
            {
                name: 'deleteByUserId',
                call: async (user) =>
                    await userRepo.deleteByUserId(user.userId),
            },
            {
                name: 'deleteByEmailHash',
                call: async (user) =>
                    await userRepo.deleteByEmailHash(user.emailHash),
            },
            {
                name: "deleteByUserUuid",
                call: async (user) =>
                    await userRepo.deleteByUserUuid(user.userUuid)

            }
        ])('$name: delete the user', async ({ call }) => {
            for (let i = 0; i < users.length; i++) {
                const user = await createRandomUser()
                const deleted = await call(user)
                expect(deleted).toBeFalsy()
                const verify= await userRepo.findByUserId(users[i].userId)
                expect(verify).not.toBeNull()
            }
        })
    })

})
