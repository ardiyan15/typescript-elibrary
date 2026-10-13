
import amqplib, { Channel, ChannelModel } from 'amqplib'
import { logger, logFormatter } from '@utils/log'
import { setDependencyStatus } from '@utils/dependencyStatus'

let connection: ChannelModel | undefined
let channel: Channel | undefined

export const connectRabbitMQ = async (): Promise<void> => {
    const host = process.env.RABBITMQ_HOST || 'localhost'
    const port = Number(process.env.RABBITMQ_PORT) || 5672
    const user = process.env.RABBITMQ_USER || 'guest'
    const password = process.env.RABBITMQ_PASSWORD || 'guest'

    const credentials =
        `${encodeURIComponent(user)}:${encodeURIComponent(password)}`

    const rabbitUrl = `amqp://${credentials}@${host}:${port}`

    const maxRetries = 5;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        let newConnection: ChannelModel | undefined;

        try {
            newConnection = await amqplib.connect(rabbitUrl);
            const newChannel = await newConnection.createChannel();

            connection = newConnection;
            channel = newChannel;
            setDependencyStatus('rabbitmq', true)

            connection.on('error', (error) => {
                setDependencyStatus('rabbitmq', false)
                logger.error(
                    logFormatter(
                        'RabbitMQ Connection Error',
                        { error: error.message },
                        'rabbitmq'
                    )
                )
            })

            connection.on('close', () => {
                logger.warn(
                    logFormatter(
                        'RabbitMQ Connection Closed',
                        {},
                        'rabbitmq'
                    )
                )

                connection = undefined
                channel = undefined
                setDependencyStatus('rabbitmq', false)
            })

            logger.info(
                logFormatter(
                    'RabbitMQ Connected Successfully',
                    { host, port },
                    'rabbitmq'
                )
            )
        } catch (error) {
            logger.error(
                logFormatter(
                    'Failed to Connect to RabbitMQ',
                    {
                        error: error instanceof Error
                            ? error.message
                            : String(error)
                    },
                    'rabbitmq'
                )
            )

            connection = undefined
            channel = undefined
            setDependencyStatus('rabbitmq', false)

            throw error
        }
    }
}

export const getRabbitChannel = (): Channel => {
    if (!channel) {
        throw new Error('RabbitMQ channel not initialized')
    }

    return channel
}

export const closeRabbitMQ = async (): Promise<void> => {
    try {
        if (channel) {
            await channel.close()
            channel = undefined
        }

        if (connection) {
            await connection.close()
            connection = undefined
        }

        logger.info(
            logFormatter(
                'RabbitMQ Closed Successfully',
                {},
                'rabbitmq'
            )
        )
    } catch (error) {
        logger.error(
            logFormatter(
                'Failed to Close RabbitMQ',
                {
                    error: error instanceof Error
                        ? error.message
                        : String(error)
                },
                'rabbitmq'
            )
        )

        throw error
    }
}
