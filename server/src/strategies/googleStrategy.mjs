/*import { Strategy as googleStrategy } from 'passport-google-oauth20'
import { handleGoogleLogin, handleGoogleSignup} from '../services/googleAuthServices.mjs'

const strategy = new googleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        //tempoary place holder for now
        callbackURL: `${process.env.SERVER_URL_DEV}${process.env.GOOGLE_CALLBACK_URL}`,
    },
    async (accessToken, refreshToken, profile, cb) => {
        //console.log(profile);
        try {
            const { sub, email } = profile._json
            const user = await handleGoogleLogin({
                googleId: sub,
                email: email,
            })
            return cb(null, user)
        } catch (err) {
            return cb(err, null)
        }
    }
)

export default strategy
*/