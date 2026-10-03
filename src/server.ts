import dotenv from 'dotenv'

import app from './app'

import { sequelize } from '@models/index'
import {
    connectRabbitMQ,
    closeRabbitMQ
} from "@utils/rabbitmq"

import {
    connectRedis,
    redisClient
} from "@utils/redis"

dotenv.config()

const port = Number(process.env.PORT) || 3000;

const startServer = async () => {
    try {
        await sequelize.sync({ alter: true })

        console.log("Database connected")

        await connectRedis()

        console.log("Redis connected")

        await connectRabbitMQ()

        console.log("RabbitMQ connected")

        const server = app.listen(port, '0.0.0.0', () => {
            console.log(`Server is running on port ${port}`)
        })

        /**
        * Graceful Shutdown
        */
       const Shutdown = async () => {
        console.log("Shutting down server...")

        server.close(async () => {
            await closeRabbitMQ()

            if(redisClient.isOpen) {
                await redisClient.quit()
            }

            await sequelize.close()

            console.log("Server closed")

            process.exit(0)
        })
       }

       process.on("SIGINT", Shutdown)
       process.on("SIGTERM", Shutdown)
        
    } catch (error) {
        console.error("Failed to start server: ", error)

        process.exit(1)
    }
}

startServer()