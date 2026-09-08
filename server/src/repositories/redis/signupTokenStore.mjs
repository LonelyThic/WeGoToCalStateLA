import { buildRedisKey } from '../../util/redisKeyBuilder.mjs'
import { UnauthorizedError } from '../../errors/unauthorizedError.mjs'
import { ServiceUnavailable } from '../../errors/serviceUnavailable.mjs'

export function createSignupTokenStore({redis, signupTokenPrefix, opt = {}}){
    return {
        save,
        consume,
    }
    async function save(key, { email, verifiedMethod }) {
        const { ttl = 300 } = opt
        //defalut time to live as 5 minute
        // append the prefix to make system consistent
        const prefixedKey = buildRedisKey(signupTokenPrefix, key)
        // set the key value pair in redis using hset for better effiency
        try {
            await redis
                .multi()
                .hset(prefixedKey, {
                    email: email,
                    verifiedMethod: verifiedMethod,
                    createdAt: Date.now(),
                })
                .expire(prefixedKey, ttl)
                .exec()
        } catch (err) {
            throw new ServiceUnavailable(
                null,
                'Signup service is temporarily unavailable. Please try again later.'
            )
        }
    }

    async function consume(key) {
        const prefixedKey = buildRedisKey(signupTokenPrefix, key)
        let replies
        try {
            replies = await redis
                .multi()
                .hgetall(prefixedKey)
                .del(prefixedKey)
                .exec()
        } catch (err) {
            throw new ServiceUnavailable(
                null,
                'Signup service is temporarily unavailable. Please try again later.'
            )
        }
        //destructure the reply
        const [[errGet, signupValue], [errDel, delCount]] = replies
        //Redis respond us with a error
        if (errGet || errDel) {
            throw new ServiceUnavailable(
                null,
                'Signup service is temporarily unavailable. Please try again.'
            )
        }

        return signupValue
    }
}