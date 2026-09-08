import {afterAll, afterEach, beforeAll, beforeEach, describe, it,expect} from "vitest";
import {createPool} from "mysql2/promise";
import {createUserRepo} from "../../../src/repositories/userRepository.mjs";
import {createThreadRepo} from "../../../src/repositories/threadsRepository.mjs";
import {createCommentRepo} from "../../../src/repositories/commentsRepository.mjs";
import {createCommentService} from "../../../src/services/content/commentsService.mjs";
import {createUserService} from "../../../src/services/users/userService.mjs";
import {createUsernameService} from "../../../src/services/users/usernameGenerator.mjs";
import {createThreadService} from "../../../src/services/content/threadsService.mjs";
import {faker} from "@faker-js/faker";
import {NotFoundError} from "../../../src/errors/notFoundError.mjs";
import {UnauthorizedError} from "../../../src/errors/unauthorizedError.mjs";

describe("commentService Integration", () => {
    let connectionPool
    let userRepo
    let threadRepo
    let commentRepo
    let userService

    let threadService
    let commentService
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
        userService = createUserService({
            userRepo,
            usernameService: createUsernameService()
        })
        threadService = createThreadService(threadRepo)
        commentService = createCommentService(
            {
                commentRepo,
                threadService,
                userService
            }
        )
        await connection.beginTransaction()
    })

    afterEach(async () => {
        await connection.rollback()
        connection.release()
    })

    afterAll(async () => {
        await connectionPool.end()
    })

    describe("get comment using comment identifier", () => {
        it.each([
            {
                name: "getByCommentId",
                call: async (comment) => commentService.getByCommentId(comment.commentId)
            },
            {
                name: "getByCommentUuid",
                call: async (comment) => commentService.getByCommentUuid(comment.commentUuid)
            }
        ])("$name get the comment resource", async ({call})=> {
            const comment = children[0]
            console.log(children)
            const verify = await call(comment)
            expect(verify.commentId).toBe(comment.commentId)
            expect(verify.commentUuid).toBe(comment.commentUuid)
        })
        it.each([
            {
                name: "getByCommentId",
                call: async (comment) => commentService.getByCommentId(comment.commentId)
            },
            {
                name: "getByCommentUuid",
                call: async (comment) => commentService.getByCommentUuid(comment.commentUuid)
            }
        ])("$name throw NotFoundError", async ({call})=> {
            const comment = {
                commentId: 100000,
                commentUuid: faker.string.uuid()
            }
            await expect(call(comment)).rejects.toBeInstanceOf(NotFoundError)
        })
    })
    describe("get comment use thread identifier", () => {
        it.each([
            {
                name: "getByThreadId",
                call: async (thread) => commentService.getByThreadId(thread.threadId)
            },
            {
                name: "getByThreadUuid",
                call: async (thread) => commentService.getByThreadUuid(thread.threadUuid)
            }
        ])("$name get the comment resource", async ({call})=> {
            const verify = threads[0]
            const {thread, comments}= await call(verify)
            expect(verify.threadId).toBe(thread.threadId)
            expect(verify.threadUuid).toBe(thread.threadUuid)
            for(const comment of comments){
                expect(comment.threadId).toBe(verify.threadId)
                expect(comment.threadUuid).toBe(verify.threadUuid)
            }
            const thread1 = threads[1]
            const verify1= await call(thread1)
            expect(verify1.thread.threadId).toBe(thread1.threadId)
            expect(verify1.comments.length).toBe(0)
        })
    })

    describe("get comment use user identifier", () => {
        it.each([
            {
                name: "getByUserId",
                call: async (user) => commentService.getByUserId(user.userId)
            },
            {
                name: "getByUserUuid",
                call: async (user) => commentService.getByUserUuid(user.userUuid)
            }
        ])("$name get the comment resource", async ({call})=> {
            const user = users[0]
            const verify = await call(user)
            for(const comment of verify){
                expect(comment.userId).toBe(user.userId)
                expect(comment.userUuid).toBe((user.userUuid))
            }
            const fakerUser = {
                userId : 111000,
                userUuid: faker.string.uuid()
            }
            const verify2 = await call(fakerUser)
            expect(verify2.length).toBe(0)
        })
    })
    describe("commentService postComment", async () => {
        it("create the comment", async () => {
            const user = users[0]
            const thread = threads[0]
            const parent= parents[0]
            const payload = {
                content: faker.lorem.sentence()
            }
            const comment = await commentService.postComment({
                userUuid: user.userUuid,
                threadUuid: thread.threadUuid,
                payload,
                parentCommentUuid: parent.commentUuid
            })
            expect(comment.userId).toBe(user.userId)
            expect(comment.threadId).toBe(thread.threadId)
            expect(comment.parentCommentId).toBe(parent.commentId)
            const user2 = users[1]
            const thread2 = threads[1]
            const payload2 = {
                content: faker.lorem.sentence()
            }
            const comment2 = await commentService.postComment({
                userUuid: user2.userUuid,
                threadUuid: thread2.threadUuid,
                payload: payload2,
            })
            expect(comment2.userId).toBe(user2.userId)
            expect(comment2.threadId).toBe(thread2.threadId)
            expect(comment2.parentCommentId).toBeNull()

        })
        it("did not create the comment and throw NotFoundError error", async () => {
            const user = users[0]
            const thread = threads[1]
            const parent= parents[0]
            const payload = {
                content: faker.lorem.sentence()
            }
            const errFun =  commentService.postComment({
                userUuid: user.userUuid,
                threadUuid: thread.threadUuid,
                payload,
                parentCommentUuid: parent.commentUuid
            })
            await expect(errFun).rejects.toBeInstanceOf(NotFoundError)
        })
    })
    describe("commentService patchComment", () => {
        it.each([
            {
                name: "patchByCommentId",
                call: async (comment, payload) => commentService.patchByCommentId({
                    commentId: comment.commentId,
                    userUuid: comment.userUuid,
                    payload
                })
            },
            {
                name: "patchByCommentUuid",
                call: async (comment, payload) => commentService.patchByCommentUuid({
                    commentUuid: comment.commentUuid,
                    userUuid: comment.userUuid,
                    payload
                })
            }
        ])("$name patch the comment", async ({call}) => {
            const comment = parents[0]
            const payload = {
                content: faker.lorem.sentence()
            }
            const verify = await call(comment, payload)
            expect(verify.content).toBe(payload.content)
            expect(verify.userId).toBe(comment.userId)
            expect(verify.threadId).toBe(comment.threadId)
            expect(verify.commentId).toBe(comment.commentId)
        })
        it.each([
            {
                name: "patchByCommentId",
                call: async (comment,user , payload) => commentService.patchByCommentId({
                    commentId: comment.commentId,
                    userUuid: user.userUuid,
                    payload
                })
            },
            {
                name: "patchByCommentUuid",
                call: async (comment,user, payload) => commentService.patchByCommentUuid({
                    commentUuid: comment.commentUuid,
                    userUuid: user.userUuid,
                    payload
                })
            }
        ])("$name patch the comment", async ({call}) => {
            const comment = parents[0]
            const payload = {
                content: faker.lorem.sentence()
            }
            const errFun = call(comment, users[3] ,payload)
            await expect(errFun).rejects.toBeInstanceOf(UnauthorizedError)


        })
    })
    describe("commentService deleteComment", () => {
        it.each([
            {
                name: "deleteByCommentId",
                call: async (comment) => commentService.deleteByCommentId({
                    commentId: comment.commentId,
                    userUuid: comment.userUuid,
                })
            },
            {
                name: "deleteByCommentUuid",
                call: async (comment) => commentService.deleteByCommentUuid({
                    commentUuid: comment.commentUuid,
                    userUuid: comment.userUuid
                })
            }
        ])("$name delete the comment", async ({call}) => {
            const comment = parents[0]
            await call(comment)
            await expect(call(comment)).rejects.toBeInstanceOf(UnauthorizedError)
        })
    })

})