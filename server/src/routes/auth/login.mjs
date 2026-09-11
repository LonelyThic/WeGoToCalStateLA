import { Router } from 'express'
import {
    emailHashPasswordSchema,
    evalReqB64UhSchema,
} from '../../validators/authValidators.mjs'
import {cookieConfig, loginTokenCookieConfig} from '../../config/cookieConfig.mjs'
import { jsend } from '../../util/jSend.mjs'
import { requireLoginToken } from '../../middlewares/requireCookie.mjs'

export function createLoginRouter({voprfService, loginTokenService, loginService}){
    const router = Router()

    router.post('/login/voprf', async (req, res) => {
        const { evalReqB64U } = evalReqB64UhSchema.parse(req.body)
        const evaluationB64U = await voprfService.evaluateVOPRF(evalReqB64U)
        const {token} = await loginTokenService.saveLoginToken()
        res.cookie("login_tx",  token, loginTokenCookieConfig)
        res.json(jsend.success({ evaluationB64U : evaluationB64U}))
    })

    router.post('/login/complete', requireLoginToken, async (req, res) => {
        const loginValue = await loginTokenService.verifyLoginToken(req.loginToken)
        const { emailHashB64U, password } = emailHashPasswordSchema.parse(req.body)
        const token = await loginService.loginUser(emailHashB64U, password)
        // Generate JWT
        // Store token in HTTP-only cookie
        res.cookie('auth_tx', token, cookieConfig)
        return res.json(jsend.success(null))
    })
    return router
}