import bcrypt from 'bcrypt'
import { Op } from "sequelize";
import sequelize from "@utils/connection";
import User, { IUser } from "@models/backoffice/users/user";
import { IDataTableResponse } from "@generals/Interfaces"
import { MessageType, ResponseData } from "../customTypes/user";
import { getRabbitChannel } from "@utils/rabbitmq";
import Privilege from "@models/backoffice/privileges/privileges";
import Submenu from '@models/backoffice/submenus/submenu';

class UserRepository {
    async findAll(start: number, length: number, search: { value: string, regex: string }): Promise<IDataTableResponse<IUser>> {
        const searchValue = search?.value || '';
        const whereCondition = searchValue ? { username: { [Op.like]: `%${searchValue}%` } } : {}

        const { rows, count } = await User.findAndCountAll({
            where: whereCondition,
            offset: start,
            limit: length,
            order: [['id', 'DESC']],
        })

        return {
            data: rows,
            recordsTotal: count,
            recordsFiltered: count,
        };
    }

    async findById(id: number | string): Promise<IUser | null> {
        return User.findByPk(id, {
            include: [
                {
                    model: Submenu,
                    as: 'submenu'
                }
            ]
        })
    }

    async findByUsername(username: string): Promise<IUser | null> {
        return await User.findOne({ where: { username } })
    }

    async create(userData: IUser): Promise<Record<string, any>> {
        const { privileges, ...userDetails } = userData

        let newPrivileges: number[] = []

        if (typeof privileges === 'string') {
            newPrivileges.push(privileges)
        } else {
            newPrivileges = privileges
        }

        userDetails.password = await bcrypt.hash(userDetails.password, 10)

        const transaction = await sequelize.transaction()

        try {
            const user = await User.create(userDetails, { transaction });
            const submenuIds = newPrivileges.map((id) => Number(id))
            await Privilege.bulkCreate(
                submenuIds.map((submenuId) => ({
                    userId: user.id,
                    submenuId
                })),
                { transaction }
            )
            await transaction.commit()
            return user.get({plain: true})
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }

    async update(id: string, userData: Partial<IUser>): Promise<[number]> {
        const { privileges, ...userDetails } = userData

        let newPrivileges: number[] = []
        if (typeof privileges === 'string') {
            newPrivileges.push(privileges)
        } else {
            newPrivileges = privileges
        }
        const submenuIds = newPrivileges.map((id) => Number(id))

        const updateData: IUser = {
            username: userDetails.username,
            email: userDetails.email,
            roles: userDetails.roles
        }

        if (userDetails.password) {
            updateData.password = await bcrypt.hash(userDetails.password, 10)
        }

        if (userDetails.image) {
            updateData.image = userDetails.image
        }

        const transaction = await sequelize.transaction()

        try {
            const user = await User.update(updateData, { where: { id }, transaction });
            await Privilege.destroy({
                where: { userId: id },
                transaction
            });

            await Privilege.bulkCreate(
                submenuIds.map((submenuId) => ({
                    userId: id,
                    submenuId
                })),
                { transaction }
            )
            await transaction.commit()
            return user
        } catch (error) {
            await transaction.rollback()
            return error
        }
    }

    async delete(id: string): Promise<number> {
        return User.destroy({ where: { id } })
    }

    async bulkCreate(path: string): Promise<ResponseData> {
        const channel = getRabbitChannel()
        await channel.assertQueue('IMPORT_USER')

        const message: MessageType = {
            'messageType': 'Import User',
            'path': path
        }

        const messageData = JSON.stringify(message)

        try {
            channel.sendToQueue('IMPORT_USER', Buffer.from(messageData))
            const response = {
                'responseCode': 200,
                'responseMessage': 'Success'
            }
            return response
        } catch (error) {
            const response = {
                'responseCode': 500,
                'responseMessage': error
            }

            return response
        }
    }
}

export default new UserRepository()