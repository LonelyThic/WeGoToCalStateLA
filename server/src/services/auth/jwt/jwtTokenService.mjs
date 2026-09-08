//generate jwt using provided payload
import jwt from 'jsonwebtoken'
const JWT_SECRET = process.env.JWT_SECRET || "hello"
const JWT_ISSUER = process.env.JWT_ISSUER || "wegoapp"

export function createJWTTokenService(){

    return{
        issueAccessToken,
        issueOIDCToken,
        issueSignupToken,
        issueLoginToken,
        issueOTPToken,
    }
    function signJWTToken({sub, expiresIn, audience, extra = {}}) {
        return jwt.sign(
            {sub, ...extra},
            JWT_SECRET,
            {
                expiresIn,
                issuer: JWT_ISSUER,
                audience,
                algorithm: 'HS256'
            }
        )
    }
    function issueAccessToken(userUuid){
        return signJWTToken({ sub: userUuid, expiresIn: '1h', audience: 'access' })
    }

    function issueOIDCToken(key){
        return signJWTToken( {sub: key, expiresIn: '5h', audience: 'oidc'})
    }

    function issueSignupToken(key){
        return signJWTToken( {sub: key, expiresIn: '5h', audience: 'signupToken'})
    }

    function issueLoginToken(key){
        return signJWTToken( {sub: key, expiresIn: '5h', audience: 'loginToken'})
    }

    function issueOTPToken(key){
        return signJWTToken( {sub: key, expiresIn: '5h', audience: 'otpToken'})
    }

}




