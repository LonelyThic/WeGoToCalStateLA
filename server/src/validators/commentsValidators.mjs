import * as z from 'zod'

export const commentIdSchema = z.object({
    commentId: z.coerce
        .number({
            message: 'Not a number',
        })
        .int({ message: 'Not a integer' }),
})

export const commentSchema = z.object({
    content: z.string({message: "Not a String"}).min(1).max(100000),
}).strict()
