import {
    describe,
    it,
    expect,
    afterEach,
    beforeAll,
    afterAll,
    beforeEach,
} from 'vitest'
import { createPool } from 'mysql2/promise'
import { createUserRepo } from '../../../src/repositories/userRepository.mjs'
import { createThreadRepo } from '../../../src/repositories/threadsRepository.mjs'
import dbMapper from "../../../src/util/dbMapper.mjs";
import {createRandomThread} from "../../seed.mjs";
import {faker} from "@faker-js/faker";
import buildPatchQuery from "../../../src/util/buildPatchQuery.mjs";


describe("threadRepo Integration", () => {
    let connectionPool
    let userRepo
    let threadRepo
    let connection
    let users
    let threads
    beforeAll(async () => {
        connectionPool = createPool(process.env.DATABASE_URL)
        users = global.users
        threads = global.threads
    },)

    beforeEach(async () => {
        connection = await connectionPool.getConnection()
        userRepo = createUserRepo(connection)
        threadRepo = createThreadRepo(connection)
        await connection.beginTransaction()
    })

    afterEach(async () => {
        await connection.rollback()
        connection.release()
    })

    afterAll(async () => {
        await connectionPool.end()
    })
    describe("threadRepo findAllThread", () => {
        it('find all Thread', async () => {
            const thread = dbMapper.fromDb(await threadRepo.findAll())
            expect(thread.length).toBe(threads.length)
        })
    })
    describe("threadRepo findThread", () => {
        it.each([
            {
                name: "findByThreadId",
                call: async (thread) => await threadRepo.findByThreadId(thread.threadId)
            },
            {
                name: "findByThreadUuid",
                call: async (thread) => await threadRepo.findByThreadUuid(thread.threadUuid)
            },
        ])("$name: successfully find the thread", async ({call}) => {
            for(let i = 0; i < threads.length; i++){
                const thread = threads[i]
                const verify = dbMapper.fromDb(await call(thread))
                console.log(verify)
                expect(verify.threadId).toBe(thread.threadId)
                expect(verify.threadUuid).toBe(thread.threadUuid)
                expect(verify.title).toBe(thread.title)
                expect(verify.content).toBe(thread.content)
                expect(verify.status).toBe("active")
                expect(verify).toHaveProperty("createdAt")
                expect(verify).toHaveProperty("updatedAt")
                expect(verify.deletedAt).toBeNull()
                expect(verify.userId).toBe(thread.userId)
                expect(verify.userUuid).toBe(thread.userUuid)
            }
        })
        it.each([
            {
                name: "findByThreadId",
                call: async (thread) => await threadRepo.findByThreadId(thread.threadId)
            },
            {
                name: "findByThreadUuid",
                call: async (thread) => await threadRepo.findByThreadUuid(thread.threadUuid)
            },
        ])("$name: does not find the thread", async ({call}) => {
            const thread = createRandomThread(users[0].userId)
            const verify = dbMapper.fromDb(await call(thread))
            expect(verify).toBeNull()
        })
    })
    describe("threadRepo findThreads", () => {
        it.each([
            {
                name: "findByUserId",
                call: async (user) => await threadRepo.findByUserId(user.userId)
            },
            {
                name: "findByUserUuid",
                call: async (user) => await threadRepo.findByUserUuid(user.userUuid)
            }
        ])("$name: find the threads", async ({call}) => {
            for(const user of users){
                const threads2= dbMapper.fromDb(await call(user))
                console.log(threads)
                for(const thread of threads2){
                    expect(thread.userId).toBe(user.userId)
                    expect(thread.userUuid).toBe(user.userUuid)
                    expect(thread).toHaveProperty("threadId")
                    expect(thread).toHaveProperty("threadUuid")
                    expect(thread).toHaveProperty("title")
                    expect(thread).toHaveProperty("content")
                    expect(thread).toHaveProperty("createdAt")
                    expect(thread).toHaveProperty("updatedAt")
                    expect(thread).toHaveProperty("deletedAt")
                    expect(thread.status).toBe("active")
                    expect(thread.username).toBe(user.username)
                    expect(thread.displayName).toBe(user.displayName)
                }
            }
        })
        it.each([
            {
                name: "findByUserId",
                call: async (user) => await threadRepo.findByUserId(user.userId)
            },
            {
                name: "findByUserUuid",
                call: async (user) => await threadRepo.findByUserUuid(user.userUuid)
            }
        ])("$name: find the threads", async ({call}) => {
            const verify  = await call({userId: 10000, userUuid: faker.string.uuid()})
            expect(verify.length).toBe(0)
        })

    })
    describe("threadRepo insertThread", () => {
        it("create the thread", async () => {
            const thread = createRandomThread(users[0].userId)
            const threadId = await threadRepo.insertThread(thread)
            const verify = dbMapper.fromDb(await threadRepo.findByThreadId(threadId))
            console.log(thread)
            console.log(verify)
            expect(verify.title).toBe(thread.title)
            expect(verify.content).toBe(thread.content)
            expect(verify.threadUuid).toBe(thread.threadUuid)
            expect(verify.userId).toBe(thread.userId)
        })
    })
    describe("threadRepo updateThread", () => {
        it.each([
            {
                name: "updateByThreadId",
                call: async (thread, userId, sqlQuery, dataList) => await threadRepo.updateByThreadId({threadId: thread.threadId, userId, sqlQuery, dataList})

            },
            {
                name: "updateByThreadUuid",
                call: async (thread, userId, sqlQuery, dataList) => await threadRepo.updateByThreadUuid({threadUuid: thread.threadUuid, userId, sqlQuery, dataList})
            }
        ])("$name update the thread", async ({call}) => {
            for(const thread of threads){
                const title = faker.lorem.sentence()
                const content = faker.lorem.paragraph()
                const {sqlQuery, dataList} = buildPatchQuery("threads", {
                    title,
                    content
                })
                const {existed, changed} = await call(thread, thread.userId, sqlQuery, dataList)
                expect(existed).toBeTruthy()
                const verify = dbMapper.fromDb(await threadRepo.findByThreadId(thread.threadId))
                expect(verify.title).toBe(title)
                expect(verify.content).toBe(content)
            }
        })
        it.each([
            {
                name: "updateByThreadId",
                call: async (thread, userId, sqlQuery, dataList) => await threadRepo.updateByThreadId({threadId: thread.threadId, userId, sqlQuery, dataList})

            },
            {
                name: "updateByThreadUuid",
                call: async (thread, userId, sqlQuery, dataList) => await threadRepo.updateByThreadUuid({threadUuid: thread.threadUuid, userId, sqlQuery, dataList})
            }
        ])("$name did not found the thread", async ({call}) => {
            const thread = {
                threadId: 10000,
                threadUuid: faker.string.uuid(),
            }
            const title = faker.lorem.sentence()
            const content = faker.lorem.paragraph()
            const {sqlQuery, dataList} = buildPatchQuery("threads", {
                title,
                content
            })
            const {existed, changed} = await call(thread, users[0].userId, sqlQuery, dataList)
            expect(existed).toBeFalsy()
        })
    })
    describe("threadRepo deleteThread", () => {
        it.each([
            {
                name: "deleteByThreadId",
                call: async (thread) => await threadRepo.deleteByThreadId({threadId: thread.threadId, userId: thread.userId})
            },
            {
                name: "deleteByThreadUuid",
                call: async (thread) => await threadRepo.deleteByThreadUuid({threadUuid: thread.threadUuid, userId: thread.userId})
            }
        ])("$name delete the thread", async ({call}) => {
           for(const thread of threads){
               const deleted = await call(thread)
               expect(deleted).toBeTruthy()
               const verify = dbMapper.fromDb(await threadRepo.findByThreadId(thread.threadId))
               console.log(verify)
               expect(verify.title).toBe("[deleted]")
               expect(verify.content).toBe("[deleted]")
               expect(verify.deletedAt).not.toBeNull()
               expect(verify.status).toBe("delete")
           }
        })
    })
})