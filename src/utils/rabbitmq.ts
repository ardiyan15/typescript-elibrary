import amqplib, { Channel, Connection } from 'amqplib'

let connection: Connection
let channel: Channel

export const connectRabbitMQ = async (): Promise<void> => {
    const RABBIT_URL = 'amqp://localhost'

    try {
        connection = await amqplib.connect(RABBIT_URL);
        channel = await connection.createChannel();
        console.log('Connected to RabbitMQ')
    } catch (error) {
        console.error("Failed to connect to RabbitMQ", error)
        process.exit(1)
    }
}

export const getRabbitChannel = (): Channel => {
    if (!channel) {
        throw new Error("RabbitMQ channel not initialized")
    }

    return channel
}

export const closeRabbitMQ = async (): Promise<void> => {
    try {
        await channel.close()
        await connection.close()
    } catch (error) {
        console.error("Error closing RabbitMQ connection", error)
    }
}