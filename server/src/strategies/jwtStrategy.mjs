import { Strategy as jwtStrategy, ExtractJwt } from 'passport-jwt'
import {getCurrentUser} from "../services/users/userService.mjs";
import dbMapper from '../util/dbMapper.mjs'
import { UnauthorizedError } from '../errors/unauthorizedError.mjs'

const strategy = new jwtStrategy(
    {
        secretOrKey: process.env.JWT_SECRET,
        //reteive the jwt token from the cookies
        jwtFromRequest: (req) => {
            if (!req || !req.cookies['auth-token']) {
                throw new UnauthorizedError({ auth: 'Missing JWT token' })
            }
            return req.cookies['auth-token']
        },
    },
    //call back function for verfie the jwt
    async (jwt_payload, done) => {
        const { userId } = jwt_payload
        if (!userId) {
            return done(
                new UnauthorizedError({ auth: 'Invalid JWT token' }),
                false
            )
        }
        try{
            const user = await getCurrentUser(userId)
            return done(null, user)
        }
        catch (err){
            done(err, false)
        }



    }
)

export default strategy
