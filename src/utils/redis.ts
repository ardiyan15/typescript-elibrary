import { createClient } from 'redis';
import { logger, logFormatter } from '@utils/log'
import { setDependencyStatus } from '@utils/dependencyStatus'

export const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
        connectTimeout: 3000,
        reconnectStrategy: retries => retries < 2 ? 500 : new Error('Redis reconnect limit reached')
    }
})

redisClient.on('ready', () => {
    logger.info(logFormatter('Redis connection ready', {}, 'redis'))
    setDependencyStatus('redis', true)
})

redisClient.on('reconnecting', () => {
    setDependencyStatus('redis', false)
})

redisClient.on('end', () => {
    setDependencyStatus('redis', false)
})

redisClient.on('error', err => {
    logger.warn(logFormatter('Redis connection error', { error: err.message }, 'redis'))
})

export const connectRedis = async (): Promise<void> => {
    try {
        await redisClient.connect()
    } catch (err) {
        logger.error(logFormatter('Failed to connect to Redis', {
            error: err instanceof Error ? err.message : String(err)
        }, 'redis'))
        throw err
    }
}
