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
import { setDependencyStatus, getUnavailableDependencies } from "@utils/dependencyStatus"
import { logger, logFormatter } from "@utils/log"

dotenv.config()

const port = Number(process.env.PORT) || 3000;

const startServer = async () => {
    try {
        try {
            await sequelize.authenticate()
            await sequelize.sync()
            setDependencyStatus('database', true)
            logger.info(logFormatter('Database connected and synchronized', {}, 'startup'))
            console.log("Database connected")
        } catch (error) {
            setDependencyStatus('database', false)
            logger.error(logFormatter('Database unavailable during startup', {
                error: error instanceof Error ? error.message : String(error)
            }, 'startup'))
            console.log("Database unavailable during startup")
        }

        try {
            await connectRedis()
            setDependencyStatus('redis', true)
            logger.info(logFormatter('Redis connected', {}, 'startup'))
            console.log("Redis connected")
        } catch (error) {
            setDependencyStatus('redis', false)
            logger.error(logFormatter('Redis unavailable during startup', {
                error: error instanceof Error ? error.message : String(error)
            }, 'startup'))
            console.log("Redis unavailable during startup")
        }

        try {
            await connectRabbitMQ()
            setDependencyStatus('rabbitmq', true)
            logger.info(logFormatter('RabbitMQ connected', {}, 'startup'))
            console.log("RabbitMQ connected")
        } catch (error) {
            setDependencyStatus('rabbitmq', false)
            logger.error(logFormatter('RabbitMQ unavailable during startup', {
                error: error instanceof Error ? error.message : String(error)
            }, 'startup'))
            console.log("RabbitMQ unavailable during startup")
        }

        const unavailable = getUnavailableDependencies()
        if (unavailable.length) {
            logger.warn(logFormatter('Starting in degraded mode', { unavailableDependencies: unavailable }, 'startup'))
            console.log("Starting in degraded mode")
        }

        const server = app.listen(port, '0.0.0.0', () => {
            logger.info(logFormatter(`HTTP server is listening on port ${port}`, { degraded: unavailable.length > 0 }, 'startup'))
            console.log(`HTTP server is listening on port ${port}`)
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
