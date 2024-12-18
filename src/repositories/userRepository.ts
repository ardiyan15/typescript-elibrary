import { Op } from "sequelize";
import User, { IUser } from "@models/backoffice/users/user";
import { IDataTableResponse } from "@generals/Interfaces"
import { MessageType, Response } from "../types/user";
import { getRabbitChannel } from "@utils/rabbitmq";

class UserRepository {
    async findAll(start: number, length: number, search: { value: string, regex: string }): Promise<IDataTableResponse<IUser>> {
        const searchValue = search?.value || '';
        const whereCondition = searchValue ? { username: { [Op.like]: `%${searchValue}%` } } : {}

        const { rows, count } = await User.findAndCountAll({
            where: whereCondition,
            offset: start,
            limit: length
        })

        return {
            data: rows,
            recordsTotal: count,
            recordsFiltered: count,
        };
    }

    async findById(id: number | string): Promise<IUser | null> {
        return User.findByPk(id)
    }

    async create(userData: IUser): Promise<User> {
        return User.create(userData)
    }

    async update(id: string, userData: Partial<IUser>): Promise<[number]> {
        delete userData.id
        return User.update(userData, { where: { id } });
    }

    async delete(id: string): Promise<number> {
        return User.destroy({ where: { id } })
    }

    async bulkCreate(path: string): Promise<Response> {
        const channel = getRabbitChannel()
        await channel.assertQueue('IMPORT_USER')

        let message: MessageType = {
            'messageType': 'Import User',
            'path': path
        }

        let messageData = JSON.stringify(message)

        try {
            channel.sendToQueue('IMPORT_USER', Buffer.from(messageData))
            let response = {
                'responseCode': 200,
                'responseMessage': 'Success'
            }
            return response
        } catch (error) {
            let response = {
                'responseCode': 500,
                'responseMessage': error
            }

            return response
        }
    }
}

export default new UserRepository()