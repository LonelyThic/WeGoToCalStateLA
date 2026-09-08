import { Router } from 'express'
import {jsend} from "../util/jSend.mjs";

export function createAPIRouter({emailOTPRouter, googleAuthRouter, loginRouter, signupRouter, userRouter, threadRouter, commentRouter,voprfRouter }){
    const router = new Router()
    router.use('/auth', emailOTPRouter)
    router.use('/auth', googleAuthRouter)
    router.use('/auth', loginRouter)
    router.use('/auth', signupRouter)
    router.use('/user', userRouter)
    router.use('/threads', threadRouter)
    router.use('/comments', commentRouter)
    router.use('/auth', voprfRouter)
    //route for testing jwt

    router.get('/health', (req, res) => {
        res.json(jsend.success(null))
    })
    return router
}