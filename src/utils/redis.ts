import { createClient } from 'redis';

export const redisClient = createClient()

export const connectRedis = async (): Promise<void> => {
    try {
        await redisClient.connect()
        console.log('Connected to redis')
    } catch (err) {
        console.error('Failed to connect to redis:', err)
    }
}

connectRedis()