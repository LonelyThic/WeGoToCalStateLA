import { describe, it, expect, beforeEach } from 'vitest'
import CommentDto from '../../src/dtos/commentDto.mjs'

let comment
describe('comment Dto unit test', () => {
    beforeEach(() => {
        comment = {
            commentId: 2,
            threadId: 1,
            userId: 1,
            parentId: 1,
            content: 'This is a comment',
            username: 'lazy-bird',
            createdAt: Date.now(),
            updatedAt: Date.now(),
            status: 'active',
        }
    })
    it('return a comment dto with public field with require format', () => {
        const commentDto = new CommentDto(comment)
        expect(commentDto).toEqual({
            commentId: comment.commentId,
            threadId: comment.threadId,
            userId: comment.userId,
            parentId: comment.parentId,
            body: comment.content,
            author: comment.username,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
            status: comment.status,
        })
    })
})
