import { createClient } from 'redis';

export const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379
    }
})

export const connectRedis = async (): Promise<void> => {
    try {
        await redisClient.connect()
    } catch (err) {
        console.error('Failed to connect to redis:', err)
        throw err
    }
}