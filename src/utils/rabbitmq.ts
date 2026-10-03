import amqplib, { Channel, ChannelModel } from 'amqplib'

let connection: ChannelModel
let channel: Channel

export const connectRabbitMQ = async (): Promise<void> => {
    const host = process.env.RABBITMQ_HOST || 'localhost'
    const port = Number(process.env.RABBITMQ_PORT) || 5672
    const user = process.env.RABBITMQ_USER || 'guest'
    const password = process.env.RABBITMQ_PASSWORD || 'guest'

    const RABBIT_URL = `amqp://${user}:${password}@${host}:${port}`

    try {
        connection = await amqplib.connect(RABBIT_URL);
        channel = await connection.createChannel();
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