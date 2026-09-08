import express from 'express'
import cookieParser from 'cookie-parser'
import { createAPIRouter } from '../routes/index.mjs'
import errorHandler from '../middlewares/errorHandler.mjs'
import { createLoginTokenStore } from '../repositories/redis/loginTokenStore.mjs'
import { redisKeysConfig } from '../config/redisKeysConfig.mjs'
import { createOIDCStore } from '../repositories/redis/oidcStore.mjs'
import { createSignupTokenStore } from '../repositories/redis/signupTokenStore.mjs'
import { createAuthRepo } from '../repositories/authRepository.mjs'
import { createCommentRepo } from '../repositories/commentsRepository.mjs'
import { createThreadRepo } from '../repositories/threadsRepository.mjs'
import { createUserRepo } from '../repositories/userRepository.mjs'
import { createUserService } from '../services/users/userService.mjs'
import { createLoginTokenService } from '../services/auth/login/loginTokenService.mjs'
import { createSignupTokenService } from '../services/auth/signup/signupTokenService.mjs'
import { createOIDCService } from '../services/auth/oidc/oidcService.mjs'
import { createGoogleAuthService } from '../services/auth/oidc/googleAuthServices.mjs'
import { openIdClient } from '../lib/openIdClient.mjs'
import { openIdConfig } from '../config/openIdConfig.mjs'
import { createPasswordService } from '../services/users/passwordService.mjs'
import { createVOPRFService } from '../services/auth/voprf/voprfService.mjs'
import { evaluator, voprfClient } from '../lib/voprf.mjs'
import { createOTPService } from '../services/auth/otp/otpService.mjs'
import { createOTPStore } from '../repositories/redis/otpStore.mjs'
import { createEmailService } from '../services/auth/email/emailService.mjs'
import { createThreadService } from '../services/content/threadsService.mjs'
import { createCommentService } from '../services/content/commentsService.mjs'
import { createEmailOTPRouter } from '../routes/auth/emailOTP.mjs'
import { createGoogleAuthRouter } from '../routes/auth/googleAuth.mjs'
import { createLoginRouter } from '../routes/auth/login.mjs'
import { createSignupRouter } from '../routes/auth/signup.mjs'
import { createUserRouter } from '../routes/userRoutes.mjs'
import { createThreadRouter } from '../routes/threadsRoutes.mjs'
import { createCommentRouter } from '../routes/commentsRoutes.mjs'
import { createUsernameService } from '../services/users/usernameGenerator.mjs'
import {createJWTTokenService} from "../services/auth/jwt/jwtTokenService.mjs";
import {createLoginService} from "../services/auth/login/loginService.mjs";
import {createVOPRFRouter} from "../routes/auth/voprf.mjs";

export function createApp(db, redis, emailService){
    const app = express()
    app.use(express.json())
    app.use(cookieParser())
    //launch up the store / repo
    const loginTokenStore = createLoginTokenStore({redis, loginTokenPrefix: redisKeysConfig.loginToken})
    const oidcStore = createOIDCStore({redis, oidcPrefix: redisKeysConfig.oidc})
    const signupTokenStore = createSignupTokenStore({redis, signupTokenPrefix: redisKeysConfig.signupToken})
    const otpStore = createOTPStore({redis, otpPrefix: redisKeysConfig.otp})

    const authRepo = createAuthRepo(db)
    const commentRepo = createCommentRepo(db)
    const threadRepo = createThreadRepo(db)
    const userRepo = createUserRepo(db)


    //launch up the service
    const jwtTokenService = createJWTTokenService()

    const voprfService = createVOPRFService({voprfClient: voprfClient, evaluator: evaluator})
    const otpService = createOTPService({otpStore,jwtTokenService, round: 10})
    const loginTokenService = createLoginTokenService({loginTokenStore, jwtTokenService})
    const signupTokenService = createSignupTokenService({signupTokenStore, jwtTokenService})
    const usernameService = createUsernameService(userRepo)
    const passwordService = createPasswordService(12)

    const googleAuthService = createGoogleAuthService(createOIDCService(
        {oidcStore: oidcStore, openIdClient : openIdClient.googleClient, openIdConfig: openIdConfig, provider: "google", jwtTokenService}
    ))
    const loginService= createLoginService({authRepo, passwordService, jwtTokenService})

    const userService = createUserService({userRepo: userRepo, usernameService:usernameService})
    const threadService = createThreadService(threadRepo)
    const commentService = createCommentService({commentRepo: commentRepo, threadService: threadService, userService,})

    //launch up the router
    const emailOTPRouter = createEmailOTPRouter({emailService: emailService, otpService:otpService,signupTokenService:signupTokenService})
    const googleAuthRouter = createGoogleAuthRouter({googleAuthService:googleAuthService, signupTokenService: signupTokenService})
    const voprfRouter= createVOPRFRouter(voprfService)
    const loginRouter = createLoginRouter({voprfService: voprfService, loginService:loginService, loginTokenService})
    const signupRouter = createSignupRouter({signupTokenService: signupTokenService, voprfService: voprfService, userService: userService, passwordService : passwordService})
    const userRouter = createUserRouter(userService)
    const threadRouter = createThreadRouter({userService, threadService})
    const commentRouter = createCommentRouter({commentService, userService})
    const router = createAPIRouter({
        emailOTPRouter: emailOTPRouter,
        googleAuthRouter: googleAuthRouter,
        loginRouter: loginRouter ,
        signupRouter: signupRouter,
        userRouter: userRouter,
        threadRouter: threadRouter,
        commentRouter: commentRouter,
        voprfRouter
    })
    app.use('/api', router)
    app.use(errorHandler)
    return app
}
