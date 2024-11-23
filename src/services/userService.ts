import { validationResult, ValidationError } from "express-validator";
import moment from "moment";

import userRepository from "../repositories/userRepository";
import { IUser } from '../models/backoffice/users/user';
import { decrypt, encrypt } from "../utils/secure";
import { Request } from "express";
import { CreateUserResult } from '../types/user'


class UserService {
    async getAllUsers(): Promise<IUser[]> {
        const users = await userRepository.findAll()

        const encryptedData = users.map(user => {
            const encryptedId = encrypt(user.id.toString());
            const createdAt = moment(user.createdAt).format("D MMMM YYYY");
            const updatedAt = moment(user.updatedAt).format("D MMMM YYYY");

            return {
                id: encryptedId,
                username: user.username,
                password: user.password,
                roles: user.roles,
                email: user.email,
                image: user.image,
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
}

export default new UserService()