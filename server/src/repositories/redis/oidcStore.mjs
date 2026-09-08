import { buildRedisKey } from '../../util/redisKeyBuilder.mjs'
import { UnauthorizedError } from '../../errors/unauthorizedError.mjs'
import { ServiceUnavailable } from '../../errors/serviceUnavailable.mjs'

export function createOIDCStore({redis, oidcPrefix, opt = {}}) {
    return{
        save,
        consume
    }
    async function save(
        key,
        { provider, codeVerifier, nonce, state },
    ) {

        //defalut time to live as 5 minute
        const { ttl = 300 } = opt
        // append the prefix to make system consistent
        const prefixedKey = buildRedisKey(oidcPrefix, key)
        // set the key value pair in redis using hset for better effiency
        try {
            await redis
                .multi()
                .hset(prefixedKey, {
                    provider,
                    codeVerifier,
                    nonce,
                    createdAt: Date.now(),
                    state,
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
        const prefixedKey = buildRedisKey(oidcPrefix, key)
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
        const [[errGet, oidcValue], [errDel, delCount]] = replies
        //Redis respond us with a error
        if (errGet || errDel) {
            throw new ServiceUnavailable(
                null,
                'Signup service is temporarily unavailable. Please try again.'
            )
        }

        return oidcValue
    }
}

