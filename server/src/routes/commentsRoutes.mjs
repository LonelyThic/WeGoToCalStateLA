import {Router} from 'express'
import CommentDto from "../dtos/commentDto.mjs";
import {jsend} from "../util/jSend.mjs";
import {commentSchema} from "../validators/commentsValidators.mjs";
import {uuidSchema} from "../validators/authValidators.mjs";
import buildCommentTree from "../util/commentTreeBuilder.mjs";
import { reqAuth } from '../middlewares/reqAuth.mjs'
import ThreadDto from '../dtos/threadDto.mjs'


export function createCommentRouter({userService, commentService}) {

    const router = Router()
    //tested

    router.get('/me', reqAuth(userService), async (req, res) => {
        const comments = await commentService.getByUserId(req.user.userId)
        const commentDTOs = comments.map((comment) => new CommentDto(comment))
        res.json(jsend.success({comments: commentDTOs}))

    })

    //tested
    router.post(
        '/me/thread/:threadUuid',
        reqAuth(userService),
        async (req, res) => {
            const userId = req.user.userId
            const threadUuid = uuidSchema.parse(req.params.threadUuid)
            const payload = commentSchema.parse(req.body)
            const comment = await commentService.postComment({
                userId,
                threadUuid,
                payload,
                parentCommentUuid: null,
            })
            res.json(
                jsend.success({
                    comment: new CommentDto(comment),
                })
            )
        }
    )
    //tested
    router.post(
        '/me/thread/:threadUuid/comment/:parentCommentUuid',
        reqAuth(userService),
        async (req, res) => {
            const userId = req.user.userId
            const threadUuid = uuidSchema.parse(req.params.threadUuid)
            const parentCommentUuid = uuidSchema.parse(
                req.params.parentCommentUuid
            )
            const payload = commentSchema.parse(req.body)
            const comment = await commentService.postComment({
                userId,
                threadUuid,
                payload,
                parentCommentUuid,
            })
            res.json(
                jsend.success({
                    comment: new CommentDto(comment),
                })
            )
        }
    )
    //tested
    router.patch('/me/:commentUuid', reqAuth(userService), async (req, res) => {
        const userId = req.user.userId
        const commentUuid = uuidSchema.parse(req.params.commentUuid)
        const payload = commentSchema.parse(req.body)
        const comment = await commentService.patchByCommentUuid({
            commentUuid,
            userId,
            payload,
        })
        res.send(
            jsend.success({
                comment: new CommentDto(comment),
            })
        )
    })

    //tested
    router.delete(
        '/me/:commentUuid',
        reqAuth(userService),
        async (req, res) => {
            const commentUuid = uuidSchema.parse(req.params.commentUuid)
            const userId = req.user.userId
            await commentService.deleteByCommentUuid({ commentUuid, userId})
            res.send(jsend.success(null))
        }
    )
    //tested
    router.get('/:commentUuid', async (req, res) => {
        const commentUuid = uuidSchema.parse(req.params.commentUuid)
        const comment = await commentService.getByCommentUuid(commentUuid)
        res.json(
            jsend.success({
                comment: new CommentDto(comment)
            })
        )
    })

    //tested
    router.get('/thread/:threadUuid',reqAuth(userService),  async (req, res) => {
        const threadUuid = uuidSchema.parse(req.params.threadUuid)
        const {thread, comments} = await commentService.getByThreadUuid(threadUuid)
        const threadDto = new ThreadDto(thread)
        const commentDtos = comments.map((comment) => new CommentDto(comment))

        const { commentDtoTreeList, commentTreeMap } =
            buildCommentTree(commentDtos)
        //store redis in future
        res.json(jsend.success({threadDto, comments: commentDtoTreeList}))
    })

    router.get('/thread/:threadUuid/comment/:commentUuid', reqAuth(userService), async (req, res) => {
        const threadUuid = uuidSchema.parse(req.params.threadUuid)
        const commentUuid = uuidSchema.parse(req.params.commentUuid)
        const { thread, comments } =
            await commentService.getByThreadUuid(threadUuid)
        const commentDtos = comments.map((comment) => new CommentDto(comment))

        const { commentDtoTreeList, commentTreeMap } =
            buildCommentTree(commentDtos)
        const subComment = commentTreeMap.get(commentUuid)
        //store redis in future
        res.json(jsend.success({ comments: subComment}))
    })


    return router
}
