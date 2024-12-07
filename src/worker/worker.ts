import { connectRabbitMQ, getRabbitChannel } from "../utils/rabbitmq";
import { importUser } from "../helper/ImportUser";
import User from "../models/backoffice/users/user";

const QUEUE = 'IMPORT_USER';
const startWorker = async () => {
    await connectRabbitMQ()

    const channel = getRabbitChannel()
    await channel.assertQueue(QUEUE)

    console.log(`Worker start listening`)

    channel.consume(QUEUE, async (msg) => {
        if (msg) {
            let data = JSON.parse(msg.content.toString())

            if(data.messageType === 'Import User') {
                console.log("Proccessing Import User")
                console.time("Processing Time");
                const result = await importUser(data.path) 
                User.bulkCreate(result.users)
                console.timeEnd("Processing Time");
                console.log("Finished Import User")
            }

            channel.ack(msg)
            console.log("Message Acknowledged")
        }
    }, {exclusive: true})
}

startWorker()
    .catch(error => {
        console.error('Error starting worker', error)
        process.exit(1)
    })