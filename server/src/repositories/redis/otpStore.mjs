import { buildRedisKey } from '../../util/redisKeyBuilder.mjs'
import { ServiceUnavailable } from '../../errors/serviceUnavailable.mjs'
import { UnauthorizedError } from '../../errors/unauthorizedError.mjs'

export function createOTPStore({redis, otpPrefix, opt = {}}){
    return{
        save,
        consume,
        deleteOTP,
        incrementAttempts
    }
    async function save(
        key,
        { email, otpCodeHash},
    ) {
        //defalut time to live as 5 minute
        const { ttl = 300 } = opt
        // append the prefix to make system consistent
        const prefixedKey = buildRedisKey(otpPrefix, key)
        // set the key value pair in redis using hset for better effiency
        try {
            await redis
                .multi()
                .hset(prefixedKey, {
                    email: email,
                    otpCodeHash: otpCodeHash,
                    attempts: 0,
                    createdAt: Date.now()
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
        const prefixedKey = buildRedisKey(otpPrefix, key)
        let otpValue
        try {
            otpValue = await redis
                .hgetall(prefixedKey)
        } catch (err) {
            throw new ServiceUnavailable(
                null,
                'Signup service is temporarily unavailable. Please try again later.'
            )
        }
        return otpValue
    }


    async function deleteOTP(key) {
        const prefixedKey = buildRedisKey(otpPrefix, key)
        try {
            await redis.del(prefixedKey)
        } catch (err) {
            throw new ServiceUnavailable(
                null,
                'OTP session is expired. please try again later.'
            )
        }
    }

    async function incrementAttempts(key){
        const prefixedKey = buildRedisKey(otpPrefix, key)
        try {
            await redis.hincrby(prefixedKey, 'attempts', 1)
        } catch (err) {
            throw new ServiceUnavailable(
                null,
                'Signup is temporarily unavailable. Please try again.'
            )
        }
    }
}