import {generateKey} from "../../../util/keyGenerator.mjs";
import {UnauthorizedError} from "../../../errors/unauthorizedError.mjs";
export function createSignupTokenService({signupTokenStore, jwtTokenService, opt ={}}){
    return {
        saveSignupToken,
        verifySignupToken,
    }


    async function saveSignupToken(email, verifiedMethod) {
        const {ttl = 300} = opt
        const key = generateKey(32)
        await signupTokenStore.save(key, { email, verifiedMethod })
        //generate token for client side
        const token = jwtTokenService.issueSignupToken(key)
        return {key, token}
    }

    async function verifySignupToken(key) {
        const signupValue = await signupTokenStore.consume(key)
        if (!signupValue || Object.keys(signupValue).length === 0) {
            throw new UnauthorizedError(
                { "signup_tx": 'Session not found' },
                'Sign up session expired. Please start again.'
            )
        }
        return signupValue.email
    }
}