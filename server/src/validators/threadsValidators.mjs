import * as z from 'zod'

export const threadIdSchema = z.object({
    threadId: z.coerce
        .number({
            message: 'Not a number',
        })
        .int({ message: 'Not a integer' }),
})

export const threadPostSchema = z
    .object({
        title: z.string({message: "Not a String"}).min(20, {message: "The title must at least contain 20 characters"}).max(200, {message: "The title  can not contain more than characters"}),
        content: z.string({message: "Not a String"}).min(1).max(20000),
    })
    .strict()

export const threadPatchSchema = threadPostSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: 'One of the fields must be defined',
    })
