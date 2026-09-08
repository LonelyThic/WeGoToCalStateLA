import { buildRedisKey } from '../../util/redisKeyBuilder.mjs'
import { ServiceUnavailable } from '../../errors/serviceUnavailable.mjs'

export function createLoginTokenStore({redis, loginTokenPrefix, opt = {}}) {
    return {
        save,
        consume,
    }
    async function save(key) {
        //defalut time to live as 5 minute
        const { ttl = 300 } = opt
        // append the prefix to make system consistent
        const prefixedKey = buildRedisKey(loginTokenPrefix, key)
        // set the key value pair in redis using hset for better effiency
        try {
            await redis
                .multi()
                .hset(prefixedKey, {
                    createdAt: Date.now(),
                })
                .expire(prefixedKey, ttl)
                .exec()
        } catch (err) {
            throw new ServiceUnavailable(
                null,
                'Login Service is temporarily unavailable. Please try again later.'
            )
        }
    }

    async function consume(key) {
        const prefixedKey = buildRedisKey(loginTokenPrefix, key)
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
                'Login Service is temporarily unavailable. Please try again later.'
            )
        }
        //destructure the reply
        const [[errGet, loginValue], [errDel, delCount]] = replies
        //Redis respond us with a error
        if (errGet || errDel) {
            throw new ServiceUnavailable(
                null,
                'Login Service is temporarily unavailable. Please try again later.'
            )
        }

        return loginValue
    }


}
