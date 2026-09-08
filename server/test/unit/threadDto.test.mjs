import { describe, it, expect, beforeEach } from 'vitest'
import ThreadDto from '../../src/dtos/threadDto.mjs'

let thread
describe('Thread Dto unit test', () => {
    beforeEach(() => {
        thread = {
            threadId: 1,
            userId: 1,
            content: "This is a body message",
            title: "This is a title message",
            username: "lazy-bird",
            createdAt: Date.now(),
            updatedAt: Date.now(),
            status: "active"
        }
    })
    it('return a thread dto with public field with require format', () => {
        const threadDto = new ThreadDto(thread)
        expect(threadDto).toEqual({
            threadId: thread.threadId,
            userId: thread.userId,
            body: thread.content,
            author : thread.username,
            title: thread.title,
            createdAt: thread.createdAt,
            updatedAt: thread.updatedAt,
            status: thread.status
        })
    })

})
