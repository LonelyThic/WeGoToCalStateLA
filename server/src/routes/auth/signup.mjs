import { Router } from 'express'
import {
    passwordSchema,
} from '../../validators/authValidators.mjs'
import { jsend } from '../../util/jSend.mjs'
import { requireSignupToken } from '../../middlewares/requireCookie.mjs'

export function createSignupRouter({signupTokenService, voprfService, userService, passwordService}){
    const router = Router()
    router.post('/signup', requireSignupToken, async (req, res) => {
        const email = await signupTokenService.verifySignupToken(req.signupToken)
        //validate and get the password using zod
        const { password } = passwordSchema.parse(req.body)
        //perform serverside voprf and create user
        const emailHash = await voprfService.handleServerVOPRF(email)
        const passwordHash = await passwordService.hashPassword(password)
        //sign up the user
        const user = await userService.createUser({emailHash, passwordHash})
        res.json(jsend.success(null))
    })
    return router
}