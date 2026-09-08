import * as client from 'openid-client'
import { BadRequestError } from '../../../errors/badRequestError.mjs'
import {generateKey} from "../../../util/keyGenerator.mjs";
import {UnauthorizedError} from "../../../errors/unauthorizedError.mjs";

export function createOIDCService({oidcStore, jwtTokenService, openIdClient, openIdConfig, provider}){
    return{
        startOIDCSignup,
        completeOIDCSignup,
    }

    async function startOIDCSignup() {
        //perform pkrf generation
        const codeVerifier = client.randomPKCECodeVerifier()
        const codeChallenge =
            await client.calculatePKCECodeChallenge(codeVerifier)
        //perform state generate
        const state = client.randomState()
        //perform nonce generation
        const nonce = client.randomNonce()
        //generate a key for tracking odic required data
        const key = generateKey(32)
        //save the codeVerifier in memory for callback use
        await oidcStore.save(key, {
            provider: provider,
            codeVerifier: codeVerifier,
            nonce: nonce,
            createdAt: Date.now(),
            state: state,
        })
        //generate signed token contains key
        const token = jwtTokenService.issueOIDCToken(key)
        //generate redirect uri
        const redirectURL = client.buildAuthorizationUrl(
            openIdClient,
            {
                redirect_uri: openIdConfig[provider].redirectUri,
                scope: 'openid email',
                state,
                nonce,
                code_challenge: codeChallenge,
                code_challenge_method: 'S256',
            }
        )
        return { token, redirectURL, key }
    }

    async function completeOIDCSignup(key, currentURL) {
        const oidcValue = await oidcStore.consume(key)
        if (!oidcValue || Object.keys(oidcValue).length === 0) {
            throw new UnauthorizedError(
                null,
                'Sign up session expired. Please try again'
            )
        }
        const { codeVerifier, state, nonce } = oidcValue
        let token
        try {
            token = await client.authorizationCodeGrant(
                openIdClient,
                currentURL,
                {
                    pkceCodeVerifier: codeVerifier,
                    expectedState: state,
                    expectedNonce: nonce,
                }
            )
        } catch (err) {
            throw new BadRequestError(
                null,
                'Sign up session expired. Please try again.'
            )
        }

        return token.claims().email
    }
}