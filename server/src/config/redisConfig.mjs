export const redisConfig = {
    redisURL: process.env.REDIS_URL|| 'redis://redis:6379',
    option: {
        redisConnectTimeoutMs: process.env.REDIS_CONNECT_TIMEOUT_MS || 5000,
        redisCommandTimeoutMs: process.env.REDIS_COMMAND_TIMEOUT_MS || 2000,
        redisMaxRetriesPerRequest: process.env.REDIS_MAX_RETRIES_PER_REQUEST || 3,
        retryStrategy(times) {
            const delay = Math.min(50 * 2 ** times, 2000)
            return delay
        },
        showFriendlyErrorStack: true,
    }

}