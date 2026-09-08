import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, it} from "vitest";
import {createPool} from "mysql2/promise";
import {createThreadRepo} from "../../../src/repositories/threadsRepository.mjs";
import {createThreadService} from "../../../src/services/content/threadsService.mjs";
import dbMapper from "../../../src/util/dbMapper.mjs";
import {faker} from "@faker-js/faker";
import {NotFoundError} from "../../../src/errors/notFoundError.mjs";
import {createRandomThread} from "../../seed.mjs";
import {UnauthorizedError} from "../../../src/errors/unauthorizedError.mjs";

describe("threadService Integration", () => {
    let connectionPool
    let connection
    let users
    let threads
    let threadRepo
    let threadService
    beforeAll(async () => {
        connectionPool = createPool(process.env.DATABASE_URL)
        users = global.users
        threads = global.threads
    } )

    beforeEach(async () => {
        connection = await connectionPool.getConnection()
        await connection.beginTransaction()
        threadRepo = createThreadRepo(connection)
        threadService = createThreadService(threadRepo)

    })

    afterEach(async () => {
        await connection.rollback()
        connection.release()
    })

    afterAll(async () => {
        await connectionPool.end()
    })

    describe("threadService.getAll ", async () => {
        it("return all the threads", async () => {
            const verify = dbMapper.fromDb(await threadService.getAll())
            expect(verify.length).toBe(threads.length)
        })
    })
    describe("threadService.getThread", () => {
        it.each([
            {name: "getByThreadId", call: async (thread) => await threadService.getByThreadId(thread.threadId)},
            {
                name: "getByThreadUuid",
                call: async (thread) => await threadService.getByThreadUuid(thread.threadUuid)
            }

        ])("$name: get the thread", async ({call}) => {
            for (const thread of threads) {
                const verify = await call(thread)
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
            {name: "getByThreadId", call: async (thread) => await threadService.getByThreadId(thread.threadId)},
            {
                name: "getByThreadUuid",
                call: async (thread) => await threadService.getByThreadUuid(thread.threadUuid)
            }

        ])("$name: get the thread", async ({call}) => {
           const thread = {
               threadId: 1000000,
               threadUuid: faker.string.uuid()
           }
           await expect(call(thread)).rejects.toBeInstanceOf(NotFoundError)
        })

    })
    describe("threadService getThreads", () => {
        it.each([
            {
                name: "getByUserId",
                call: async (user) => await threadService.getByUserId(user.userId)
            },
            {
                name: "getByUserUuid",
                call: async (user) => await threadService.getByUserUuid(user.userUuid)
            }
        ])("$name: got the threads", async ({call}) => {
            for(const user of users){
                const threads2 = await call(user)
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
                name: "getByUserId",
                call: async (user) => await threadService.getByUserId(user.userId)
            },
            {
                name: "getByUserUuid",
                call: async (user) => await threadService.getByUserUuid(user.userUuid)
            }
        ])("$name: no thread, return empty []", async ({call}) => {
            const user = {userId: 10000, userUuid: faker.string.uuid()}
            expect(await call(user)).toEqual([])
        })

    })
    describe("threadService Post", () => {
        it('create a thread', async () => {
            const thread = createRandomThread(users[0].userId)
            const verify = await threadService.postByUserId(users[0].userId, thread)
            expect(verify.title).toBe(thread.title)
            expect(verify.content).toBe(thread.content)
            expect(verify.userId).toBe((users[0].userId))
        })
    })

    describe("threadService patchThread", () => {
        it.each([
            {
                name: "patchByThreadId",
                call: async (thread, userId, payload) => await threadService.patchByThreadId({threadId: thread.threadId, userId, payload})

            },
            {
                name: "patchByThreadUuid",
                call: async (thread, userId, payload )=> await threadService.patchByThreadUuid({threadUuid: thread.threadUuid, userId, payload})
            }
        ])("$name patch the thread", async ({call}) => {
           for (const thread of threads){
               const title = faker.lorem.sentence()
               const content = faker.lorem.paragraph()
               const verify= await call(thread, thread.userId, {
                   title, content
               })
               expect(verify.title).toBe(title)
               expect(verify.content).toBe(content)
           }
        })

        it.each([
            {
                name: "patchByThreadId",
                call: async (thread, userId, payload) => await threadService.patchByThreadId({threadId: thread.threadId, userId, payload})

            },
            {
                name: "patchByThreadUuid",
                call: async (thread, userId, payload )=> await threadService.patchByThreadUuid({threadUuid: thread.threadUuid, userId, payload})
            }
        ])("$name: throw unauthorized error ", async ({call}) => {
            const thread = threads[0]
            const title = faker.lorem.sentence()
            const content = faker.lorem.paragraph()
            await expect(call(thread, thread.userId + 1000, {
                title, content
            })).rejects.toBeInstanceOf(UnauthorizedError)
        })
    })

    describe("threadService deleteThread", () => {
        it.each([
            {
                name: "deleteByThreadId",
                call: async (thread) => await threadService.deleteByThreadId({
                    threadId: thread.threadId,
                    userId: thread.userId
                })
            },
            {
                name: "deleteByThreadUuid",
                call: async (thread) => await threadService.deleteByThreadUuid({
                    threadUuid: thread.threadUuid,
                    userId: thread.userId
                })
            }
        ])("$name delete the thread", async ({call}) => {
            for(const thread of threads){
                await call(thread)
                const verify = await threadService.getByThreadId(thread.threadId)
                console.log(verify)
                expect(verify.title).toBe("[deleted]")
                expect(verify.content).toBe("[deleted]")
                expect(verify.deletedAt).not.toBeNull()
                expect(verify.status).toBe("delete")
            }
        })
        it.each([
            {
                name: "deleteByThreadId",
                call: async (thread) => await threadService.deleteByThreadId({
                    threadId: thread.threadId,
                    userId: thread.userId
                })
            },
            {
                name: "deleteByThreadUuid",
                call: async (thread) => await threadService.deleteByThreadUuid({
                    threadUuid: thread.threadUuid,
                    userId: thread.userId
                })
            }
        ])("$name throw unauthorize error", async ({call}) => {
            let thread = {
                threadId: 10000,
                threadUuid: threads[0].threadUuid,
                userId: 100,
            }
            await expect(call(thread)).rejects.toBeInstanceOf(UnauthorizedError)
            let thread2 = threads[3]
            await call(thread2)
            await expect(call(thread)).rejects.toBeInstanceOf(UnauthorizedError)

        })
    })


})
