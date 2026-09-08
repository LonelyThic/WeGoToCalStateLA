const REDIS_SYSTEM_PREFIX = "wego:"

export const redisKeysConfig = {
    oidc : REDIS_SYSTEM_PREFIX + "auth:oidc:",
    otp: REDIS_SYSTEM_PREFIX + "auth:otp:",
    signupToken: REDIS_SYSTEM_PREFIX + "auth:signupToken:",
    loginToken: REDIS_SYSTEM_PREFIX + "auth:loginToken:"

}