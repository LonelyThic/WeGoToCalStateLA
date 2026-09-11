import { jwtVerify } from 'jose'
import jwt from 'jsonwebtoken'
import { keycloakConfig} from '../config/authConfig.mjs'
import { UnauthorizedError } from '../errors/unauthorizedError.mjs'
import { keycloakJWK } from '../lib/jose.mjs'

const JWT_SECRET = process.env.JWT_SECRET || "hello"
const JWT_ISSUER = process.env.JWT_ISSUER || "wegoapp"

export function reqAuth(userService){
    return async function(req, res, next){
        const accessToken = req.get('X-access-token')
        const authCookie = req.cookies?.auth_tx

        if (!accessToken && !authCookie) {
            throw new UnauthorizedError({"auth": "Not authorized"}, "You are not authorized, please try again")
        }

        if (accessToken && keycloakJWK) {
            try{
                const { payload } = await jwtVerify(accessToken, keycloakJWK, {
                    issuer: keycloakConfig.issuer,
                    audience: keycloakConfig.audience
                });
                req.accessToken = {
                    userUuid: payload.sub,
                    createdAt: new Date(Number(payload.createdTimestamp)),
                    username: payload.preferred_username,
                    roles: [
                        ...(payload.realm_access?.roles ?? []),
                        ...(payload.resource_access?.['wego-customer']?.roles ?? []),
                    ],
                }
                req.user = await userService.provisionUser(req.accessToken)
                return next()
            }
            catch (err){
                throw new UnauthorizedError({"auth": "Not authorized"}, "You are not authorized, please try again")
            }
        }

        try{
            const payload = jwt.verify(authCookie, JWT_SECRET, { issuer: JWT_ISSUER, audience: 'access' })
            req.user = await userService.getByUserUuid(payload.sub)
            return next()
        }
        catch (err){
            throw new UnauthorizedError({"auth": "Not authorized"}, "You are not authorized, please try again")
        }
    }
}