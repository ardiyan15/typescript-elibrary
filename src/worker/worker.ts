import { connectRabbitMQ, getRabbitChannel } from "../utils/rabbitmq";
import { importUser } from "../helper/ImportUser";
import User from "../models/backoffice/users/user";
import sequelize from '../utils/connection'

const QUEUE = 'IMPORT_USER';
const startWorker = async () => {
    await connectRabbitMQ()

    User.initModel(sequelize)

    const channel = getRabbitChannel()
    await channel.assertQueue(QUEUE)

    await User.initModel(sequelize)

    console.log(`Worker start listening`)

    channel.consume(QUEUE, async (msg) => {
        if (msg) {
            const data = JSON.parse(msg.content.toString())

            if(data.messageType === 'Import User') {
                console.log("Proccessing Import User")
                console.time("Processing Time");
                const result = await importUser(data.path)
                await User.bulkCreate(result.users)
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