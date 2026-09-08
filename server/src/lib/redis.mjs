import { redisConfig } from '../config/redisConfig.mjs'
import Redis from 'ioredis'

const {
    redisURL,
    option
} = redisConfig

const redis = new Redis(redisURL, option)

redis.on('connect', () => {
    console.log('redis connect')
})

redis.on('ready', () => {
    console.log('[redis] ready')
})

redis.on('reconnecting', (time) => {
    console.warn(`[redis] reconnecting in ${time}ms`)
})

redis.on('error', (err) => {
    // ioredis emits errors for connection issues too; don't crash the process here.
    console.error('[redis] error:', err?.message || err)
})

redis.on('end', () => {
    console.warn('[redis] connection closed')
})

export {redis}