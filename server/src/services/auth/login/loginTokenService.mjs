import {generateKey} from "../../../util/keyGenerator.mjs";
import {UnauthorizedError} from "../../../errors/unauthorizedError.mjs";

export function createLoginTokenService({loginTokenStore, jwtTokenService}) {
    return {
        saveLoginToken,
        verifyLoginToken,
    }

    async function saveLoginToken() {
        const key = generateKey(32)
        await loginTokenStore.save(key, {})
        //generate token for client side
        const token = jwtTokenService.issueLoginToken(key)
        return {key, token}
    }

    async function verifyLoginToken(key) {
        const loginValue =
            await loginTokenStore.consume(key)
        if (!loginValue || Object.keys(loginValue).length === 0) {
            throw new UnauthorizedError(
                { "login_tx": 'Session not found' },
                'Login session expired. Please try again'
            )
        }
        return loginValue
    }
}
