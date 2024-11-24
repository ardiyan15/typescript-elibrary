import fs from 'fs'
import amqplib from 'amqplib'

const RABBIT_URL = 'amqp://localhost'
const QUEUE_NAME = 'taskQueue'

const startConsumer = async () => {
    const connection = await amqplib.connect(RABBIT_URL)
    const channel = await connection.createChannel()
    await channel.assertQueue(QUEUE_NAME)

    console.log('waiting for message')
    channel.consume(QUEUE_NAME, (msg) => {
        if (msg) {
            const taskData = JSON.parse(msg.content.toString())
            console.log('Proccessing task:', taskData)


            const filePath = './example.txt'; // Specify the file path
            const content = 'Hello, this is the content of the file!'; // The content to write to the file

            // Write the content to the file
            setTimeout(() => {
                fs.writeFile(filePath, content, (err) => {
                    if (err) {
                        console.error('Error writing to file:', err);
                        return;
                    }
                    console.log(`File created and content written to ${filePath}`);
                });
            }, 5000)
            channel.ack(msg)
            console.log('Task processed')
        }
    })
}

export default startConsumer