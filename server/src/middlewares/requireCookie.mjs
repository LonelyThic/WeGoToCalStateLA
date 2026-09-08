import jwt from 'jsonwebtoken'
import { UnauthorizedError } from '../errors/unauthorizedError.mjs'

export function requireCookie(cookieName, verifyFn, option = {}) {
    //default for option
    const {
        signed = false,
        attachTo = cookieName,
        clearCookie = false,
    } = option

    return async function (req, res, next) {
        //retrieve the cookies
        const cookies = signed ? req.signedCookies : req.cookies
        const token = cookies[cookieName]
        if(!token){
            throw new UnauthorizedError({ [cookieName]: "cookie does not exist" }, "Cookie does not exist"  )
        }
        const result = await verifyFn(token)
        if (clearCookie) {
            res.clearCookie(cookieName)
        }
        req[attachTo] = result
        next()
    }
}

export const requireJWTAuth = requireCookie(
    'auth_tx',
    async function (token) {
        //perform jwt check
        let decoded
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
        } catch (err) {
            throw new UnauthorizedError({"auth_tx": "Invalid Cookie"}, "Session ended")
        }
        const { sub } = decoded
        if (!sub) {
            throw new UnauthorizedError({"auth_tx": "Invalid Cookie"}, "Session ended")
        }
        return sub
    },
    { signed: false, attachTo: 'userUuid' }
)



export const requireOIDCId = requireCookie(
    'oidc_tx',
    async function (token) {
        //perform jwt check
        let decoded
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
        } catch (err) {
            throw new UnauthorizedError(
                { error: 'invalid_jwt' },
                'Sign up session expired. Please try again'
            )
        }
        const { sub } = decoded
        if (!sub) {
            throw new UnauthorizedError(
                { error: 'invalid_jwt_format' },
                'Sign up session expired. Please try again'
            )
        }
        return sub
    },
    { signed: false, attachTo: 'oidc', clearCookie: true }
)

export const requireOTPToken = requireCookie(
    'otp_tx',
    async function (token) {
        //perform jwt check
        let decoded
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
        } catch (err) {
            throw new UnauthorizedError(
                { "otp_tx": 'Invalid Cookie' },
                'Authentication required'
            )
        }
        const { sub } = decoded
        if (!sub) {
            throw new UnauthorizedError(
                { "otp_tx": 'Invalid Cookie' },
                'Authentication required'
            )
        }
        return sub
    },
    { signed: false, attachTo: 'otpToken', clearCookie: false}
)


export const requireSignupToken = requireCookie(
    'signup_tx',
    async function (token) {
        //perform jwt check
        let decoded
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
        } catch (err) {
            throw new UnauthorizedError(
                { "signup_tx": 'Invalid Cookie' },
                'Sign up session expired. Please try again.'
            )
        }
        const { sub } = decoded
        if (!sub) {
            throw new UnauthorizedError(
                { "signup_tx": 'Invalid Cookie' },
                'Sign up session expired. Please try again.'
            )
        }
        return sub
    },
    { signed: false, attachTo: 'signupToken', clearCookie: true }
)

export const requireLoginToken= requireCookie(
    'login_tx',
    async function (token) {
        //perform jwt check
        let decoded
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
        } catch (err) {
            throw new UnauthorizedError(
                { "login_tx": 'Invalid Cookie' },
                'Login session expired. Please try again.'
            )
        }
        const { sub } = decoded
        if (!sub) {
            throw new UnauthorizedError(
                { "login_tx": 'Invalid Cookie' },
                'Login session expired. Please try again.'
            )
        }
        return sub
    },
    { signed: false, attachTo: 'loginToken', clearCookie: true }
)


