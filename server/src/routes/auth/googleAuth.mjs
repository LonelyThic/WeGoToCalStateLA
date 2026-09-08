import { Router } from 'express'
import {oidcCookieConfig, signupTokenCookieConfig } from "../../config/cookieConfig.mjs";
import { requireOIDCId } from '../../middlewares/requireCookie.mjs'
import { jsend } from '../../util/jSend.mjs'

export function createGoogleAuthRouter({googleAuthService, signupTokenService}){
    const router = new Router()
    router.get('/google', async (req, res) => {
        const { token, redirectURL } = await googleAuthService.startGoogleSignup()
        res.cookie('oidc_tx', token, oidcCookieConfig)
        res.redirect(redirectURL.toString())
    })

    router.get('/google/callback', requireOIDCId, async (req, res) => {
        const currentURL = new URL(
            `${req.protocol}://${req.get('host')}${req.originalUrl}`
        )
        const email = await googleAuthService.completeGoogleSignup(req.oidc, currentURL)
        //assign user a verified token to user
        const {token} = await signupTokenService.saveSignupToken(
            email,
            'open id'
        )
        res.cookie('signup_tx', token, signupTokenCookieConfig)
        res.json(jsend.success(null))
    })
    return router
}