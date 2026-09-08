import * as z from 'zod'
export const userIdSchema = z.object({
    userId: z.coerce
        .number({
            message: 'Not a number',
        })
        .int({ message: 'Not a integer' }),
})

export const usernameSchema = z.object({
    username: z
        .string()
        .min(5, { messsage: 'String must be at least 5 character long' })
        .max(21, { message: 'String must be at most 21 characters long' }),
})

export const userSchema = z
    .object({
        //can be add more field later when there is more changeable data
        displayName: z
            .string()
            .min(5, { message: 'String must be at least 5 characters long' })
            .max(21, { message: 'String must be at most 21 characters long' }),
    })
    .partial()
    .refine(({ displayName }) => displayName !== undefined, {
        message: 'One of the fields must be defined',
    })

//change the password and email require more process, so defining a individual schema might be better
