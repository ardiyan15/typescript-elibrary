import amqplib from 'amqplib'

const RABBIT_URL = 'amqp://localhost'
const QUEUE_NAME = 'taskQueue'

const producer = async (taskData: any) => {
    const connection = await amqplib.connect(RABBIT_URL)
    const channel = await connection.createChannel()
    await channel.assertQueue(QUEUE_NAME)
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(taskData)))
    console.log('Task sent to queue', taskData)
    await channel.close()
    await connection.close()
}

export default producer;