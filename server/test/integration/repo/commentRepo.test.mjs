import {afterAll, afterEach, beforeAll, beforeEach, describe, it, expect} from "vitest";
import {createPool} from "mysql2/promise";
import {createUserRepo} from "../../../src/repositories/userRepository.mjs";
import {createThreadRepo} from "../../../src/repositories/threadsRepository.mjs";
import {createCommentRepo} from "../../../src/repositories/commentsRepository.mjs";
import dbMapper from "../../../src/util/dbMapper.mjs";
import {faker} from "@faker-js/faker";
import buildPatchQuery from "../../../src/util/buildPatchQuery.mjs";

describe("commentRepo Integration", () => {
    let connectionPool
    let userRepo
    let threadRepo
    let commentRepo
    let connection
    let users
    let threads
    let parents
    let children
    beforeAll(async () => {
        connectionPool = createPool(process.env.DATABASE_URL)
        users = global.users
        threads = global.threads
        parents = global.parents
        children = global.children
    },)

    beforeEach(async () => {
        connection = await connectionPool.getConnection()
        userRepo = createUserRepo(connection)
        threadRepo = createThreadRepo(connection)
        commentRepo = createCommentRepo(connection)
        await connection.beginTransaction()
    })

    afterEach(async () => {
        await connection.rollback()
        connection.release()
    })

    afterAll(async () => {
        await connectionPool.end()
    })
    describe("commentRepo.findComment", () => {
        it.each([
            {
                name: "findByCommentId",
                call: async (comment) => await commentRepo.findByCommentId(comment.commentId)
            },
            {
                name: "findByCommentUuid",
                call: async (comment) => await commentRepo.findByCommentUuid(comment.commentUuid)
            }
        ])("$name: find the thread", async ({call}) => {
            for (const parent of parents) {
                const verify = dbMapper.fromDb(await call(parent))
                expect(verify).not.toBeNull()
                expect(verify.commentId).toBe(parent.commentId)
                expect(verify.commentUuid).toBe(parent.commentUuid)
                expect(verify.content).toBe(parent.content)
                expect(verify).toHaveProperty("createdAt")
                expect(verify).toHaveProperty("updatedAt")
                expect(verify).toHaveProperty("deletedAt")
                expect(verify.deletedAt).toBeNull()
                expect(verify.status).toBe("active")
                expect(verify.threadId).toBe(parent.threadId)
                expect(verify.parentCommentId).toBeNull()
                expect(verify.parentCommentUuid).toBeNull()
                expect(verify.userId).toBe(parent.userId)
                expect(verify).toHaveProperty("userUuid")
                expect(verify).toHaveProperty("username")
                expect(verify).toHaveProperty("displayName")
            }
            for (const child of children) {
                console.log(child)
                const verify = dbMapper.fromDb(await call(child))
                console.log(verify)
                expect(verify).not.toBeNull()
                expect(verify.commentId).toBe(child.commentId)
                expect(verify.commentUuid).toBe(child.commentUuid)
                expect(verify.content).toBe(child.content)
                expect(verify).toHaveProperty("createdAt")
                expect(verify).toHaveProperty("updatedAt")
                expect(verify).toHaveProperty("deletedAt")
                expect(verify.deletedAt).toBeNull()
                expect(verify.status).toBe("active")
                expect(verify.threadId).toBe(child.threadId)
                expect(verify.parentCommentId).toBe(child.parentCommentId)
                expect(verify.parentCommentUuid).not.toBeNull()
                expect(verify.userId).toBe(child.userId)
                expect(verify).toHaveProperty("userUuid")
                expect(verify).toHaveProperty("username")
                expect(verify).toHaveProperty("displayName")
            }
        })
        it.each([
            {
                name: "findByCommentId",
                call: async (comment) => await commentRepo.findByCommentId(comment.commentId)
            },
            {
                name: "findByCommentUuid",
                call: async (comment) => await commentRepo.findByCommentUuid(comment.commentUuid)
            }
        ])("$name: did not find the thread", async ({call}) => {
            const thread = {
                threadId: 9999,
                threadUuid: faker.string.uuid()
            }
            const verify = dbMapper.fromDb(await call(thread))
            expect(verify).toBeNull()
        })
    })
    describe("commentRepo.findComments", () => {
        it.each([
            {
                name: "findByUserId",
                call: async (user) => await commentRepo.findByUserId(user.userId),
            },
            {
                name: "findByUserUuid",
                call: async (user) => await commentRepo.findByUserUuid(user.userUuid)
            }
        ])("$name find the comments", async ({call}) => {
            for (const user of users) {
                const verifies = dbMapper.fromDb(await call(user))
                for (const verify of verifies) {
                    expect(verify.userId).toBe(user.userId)
                    expect(verify.userUuid).toBe(user.userUuid)
                    expect(verify).toHaveProperty("content")
                    expect(verify).toHaveProperty("username")
                }

            }
        })
        it.each([
            {
                name: "findByUserId",
                call: async (user) => await commentRepo.findByUserId(user.userId),
            },
            {
                name: "findByUserUuid",
                call: async (user) => await commentRepo.findByUserUuid(user.userUuid)
            }
        ])("$name find the comments", async ({call}) => {
            const user = {
                userId: 9999,
                userUuid: faker.string.uuid()
            }
            const verify = dbMapper.fromDb(await call(user))
            expect(verify.length).toBe(0)
        })
    })
    describe("commentRepo findComment", () => {
        it.each([
            {
                name: "findByThreadId",
                call: async (thread) => await commentRepo.findByThreadId(thread.threadId),
            },
            {
                name: "findByThreadUuid",
                call: async (thread) => await commentRepo.findByThreadUuid(thread.threadUuid)
            }
        ])("$name find the comments", async ({call}) => {
            console.log(threads)
            const verifies = dbMapper.fromDb(await call(threads[0]))
            for (const verify of verifies) {
                expect(verify.threadId).toBe(threads[0].threadId)
                expect(verify.threadUuid).toBe(threads[0].threadUuid)
            }
            const verifies2 = dbMapper.fromDb(await call(threads[1]))
            expect(verifies2.length).toBe(0)

        })
    })
    describe("commentRepo insertComment", () => {
        it("insert the comment", async () => {
            const {inserted, insertId} = await commentRepo.insertComment({
                userId: users[0].userId,
                threadId: threads[1].threadId,
                content: "hello this is a test",
                commentUuid: faker.string.uuid()
            })
            expect(inserted).toBeTruthy()
            const verify = dbMapper.fromDb(await commentRepo.findByCommentId(insertId))
            expect(verify).not.toBeNull()
            expect(verify.commentId).toBe(insertId)
            expect(verify.content).toBe("hello this is a test",)
            console.log(verify.parentCommentId)
            expect(verify.parentCommentId).toBeNull()
        })
    })
    describe("commentRepo insertCommentWithParent", async () =>{
        it("insert the comment", async () => {
            const {inserted, insertId} = await commentRepo.insertCommentWithParent({
                userId: users[0].userId,
                threadId: threads[0].threadId,
                parentCommentUuid: parents[0].commentUuid,
                content: "hello this is a test",
                commentUuid: faker.string.uuid()
            })
            expect(inserted).toBeTruthy()
            const verify = dbMapper.fromDb(
                await commentRepo.findByCommentId(insertId)
            )
            expect(verify.userId).toBe(users[0].userId)
            expect(verify.threadId).toBe(threads[0].threadId)
            expect(verify.parentCommentId).toBe(parents[0].commentId)
            expect(verify.parentCommentUuid).toBe(parents[0].commentUuid)
            expect(verify.content).toBe("hello this is a test")
        })
        it("did not insert user", async () => {
            const {inserted, insertId} = await commentRepo.insertCommentWithParent({
                userId: users[0].userId,
                threadId: threads[1].threadId,
                parentCommentUuid: parents[0].parentCommentUuid,
                content: "hello this is a test",
                commentUuid: faker.string.uuid()
            })
            expect(inserted).toBeFalsy()
        })
    })

    describe("commentRepo deleteComment", () => {
        it.each([
            {
                name: "deleteByCommentId",
                call: async (data) => await commentRepo.deleteByCommentId({
                    userId: data.userId,
                    commentId: data.commentId
                }),
            },
            {
                name: "deleteByCommentUuid",
                call: async (data) => await commentRepo.deleteByCommentUuid({
                    userId: data.userId,
                    commentUuid: data.commentUuid
                }),
            }
        ])("$name delete the comment", async ({call}) => {
            for (const comment of parents) {
                const deleted = await call(comment)
                expect(deleted).toBeTruthy()
                const verified = dbMapper.fromDb(await commentRepo.findByCommentId(comment.commentId))
                expect(verified).not.toBeNull()
                expect(verified.deletedAt).not.toBeNull()
                expect(verified.content).toBe('[deleted]')
                expect(verified.status).toBe("delete")
                expect(verified.commentId).toBe(comment.commentId)
                expect(verified.commentUuid).toBe(comment.commentUuid)
                expect(verified.userId).toBe(comment.userId)
                expect(verified.threadId).toBe(comment.threadId)
                const deleted2 = await call(comment)
                expect(deleted2).toBeFalsy()
            }
        })
        it.each([
            {
                name: "deleteByCommentId",
                call: async (data) => await commentRepo.deleteByCommentId({
                    userId: data.userId,
                    commentId: data.commentId
                }),
            },
            {
                name: "deleteByCommentUuid",
                call: async (data) => await commentRepo.deleteByCommentUuid({
                    userId: data.userId,
                    commentUuid: data.commentUuid
                }),
            }
        ])("$name did not delete the comment due to ownership ", async ({call}) => {
            const comment = {...parents[0]}
            comment.userId = 11000
            const deleted = await call(comment)
            expect(deleted).toBeFalsy()

        })
    })
    describe("commentRepo patchComment", () => {
        it.each([
            {
                name: "updateByCommentId",
                call: async (data) => await commentRepo.updateByCommentId({
                    commentId: data.commentId,
                    userId: data.userId,
                    sqlQuery: data.sqlQuery,
                    dataList: data.dataList
                }),
            },
            {
                name: "updateByCommentUuid",
                call: async (data) => await commentRepo.updateByCommentUuid({
                    commentUuid: data.commentUuid,
                    userId: data.userId,
                    sqlQuery: data.sqlQuery,
                    dataList: data.dataList
                }),
            }
        ])("$name update the comment", async ({call}) => {
            for (const comment of parents) {
                const {sqlQuery, dataList} = buildPatchQuery("comments", {
                    content: "this is a hard test"
                })
                const data = {...comment, sqlQuery, dataList}
                const {existed, changed} = await call(data)
                expect(existed).toBeTruthy()
                expect(changed).toBeTruthy()
                const verify = dbMapper.fromDb(
                    await commentRepo.findByCommentId(comment.commentId)
                )
                expect(verify.content).toBe("this is a hard test")
                expect(verify.userId).toBe(data.userId)
            }
        })
        it.each([
            {
                name: "updateByCommentId",
                call: async (data) => await commentRepo.updateByCommentId({
                    commentId: data.commentId,
                    userId: data.userId,
                    sqlQuery: data.sqlQuery,
                    dataList: data.dataList
                }),
            },
            {
                name: "updateByCommentUuid",
                call: async (data) => await commentRepo.updateByCommentUuid({
                    commentUuid: data.commentUuid,
                    userId: data.userId,
                    sqlQuery: data.sqlQuery,
                    dataList: data.dataList
                }),
            }
        ])("$name did not update the comment", async ({call}) => {
            const comment = {...parents[0]}
            comment.userId = 10000
            const {sqlQuery, dataList} = buildPatchQuery("comments", {
                content: "this is a hard test"
            })
            const data = {...comment, sqlQuery, dataList}
            let {existed, changed} = await call(data)
            expect(existed).toBeFalsy()
            expect(changed).toBeFalsy()
            const verify = dbMapper.fromDb(
                await commentRepo.findByCommentId(comment.commentId)
            )
            expect(verify.content).toBe(comment.content)

            await commentRepo.deleteByCommentId(comment)
            const data2 = {...comment, sqlQuery, dataList}
            let verify2 = await call(data2)
            expect(verify2.existed).toBeFalsy()
            expect(verify2.changed).toBeFalsy()
        })
    })
})