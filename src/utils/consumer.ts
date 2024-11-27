import amqplib from 'amqplib'
import { importUser } from '../helper/ImportUser'
import User from "@models/backoffice/users/user";

const RABBIT_URL = 'amqp://localhost'

const startConsumer = async (filePath: string) => {
    try {
        // Attempt to connect to RabbitMQ
        const connection = await amqplib.connect(RABBIT_URL);
        const channel = await connection.createChannel();

        const IMPORT_USER = 'IMPORT_USER';
        await channel.assertQueue(IMPORT_USER);

        await channel.close();
        await connection.close();

        try {
            const result = await importUser(filePath)
            await User.bulkCreate(result.users)

            const response = {
                'responseCode': 200,
                'responseMessage': 'Success'
            };

            return response
        } catch(err) {
            const response = {
                'responseCode': 500,
                'responseMessage': err
            }

            return response
        }
    } catch (error) {
        console.log('failed')
        console.error('RabbitMQ connection error:', error);
    }
}

export default startConsumer