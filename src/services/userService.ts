import { promises as fsPromises } from "fs";
import path from "path";
import { validationResult, ValidationError } from "express-validator";
import moment from "moment";

import userRepository from "@repositories/userRepository";
import { IUser } from '@models/backoffice/users/user';
import { decrypt, encrypt } from "@utils/secure";
import { Request } from "express";
import { CreateUserResult, TemplateUser } from '../types/user'


class UserService {
    async getAllUsers(): Promise<IUser[]> {
        const users = await userRepository.findAll()

        const encryptedData = users.map(user => {
            const encryptedId = encrypt(user.id.toString());
            const createdAt = moment(user.createdAt).format("D MMMM YYYY");
            const updatedAt = moment(user.updatedAt).format("D MMMM YYYY");

            let userImage = user.image

            if (!user.image) {
                userImage = `img/default-profile.jpg`
            }

            return {
                id: encryptedId,
                username: user.username,
                password: user.password,
                roles: user.roles,
                email: user.email,
                image: userImage,
                createdAt,
                updatedAt
            }
        })

        return encryptedData
    }

    async getUserBydId(id: string): Promise<IUser | null> {
        const userId = decrypt(id)
        const user = userRepository.findById(userId)
        return user;
    }

    async createUser(request: Request): Promise<CreateUserResult> {
        const errors = validationResult(request)

        if (!errors.isEmpty()) {
            const results = {
                isError: true,
                errors: errors.array()
            }
            return results
        }

        const userData: Partial<IUser> = request.body;
        delete userData.id;

        const results = {
            isError: false,
            errors: [] as ValidationError[]
        }

        return results

    }

    async updateUser(id: string, userData: Partial<IUser>): Promise<[number]> {
        delete userData.id
        const userId = decrypt(id)
        return userRepository.update(userId, userData)
    }

    async deleteUser(id: string): Promise<number> {
        const userId = decrypt(id)
        return userRepository.delete(userId)
    }

    async download(templateName: string): Promise<TemplateUser> {
        const filePath = path.join(__dirname, '../public/templates', templateName)

        try {
            await fsPromises.access(filePath)
            const result = {
                responseCode: 200,
                responseMessage: 'Success',
                data: filePath
            }

            return result
        } catch (err) {
            const result = {
                responseCode: 404,
                responseMessage: 'Not Found',
                data: err
            }

            return result
        }
    }
}

export default new UserService()