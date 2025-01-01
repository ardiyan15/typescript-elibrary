import { promises as fsPromises } from "fs";
import path from "path";
import { validationResult, ValidationError } from "express-validator";
import moment from "moment";
import bcrypt from 'bcrypt'

import userRepository from "@repositories/userRepository";
import { IUser, IUserResponse } from '@models/backoffice/users/user';
import { decrypt, encrypt } from "@utils/secure";
import { Request, Response } from "express";
import { CreateUserResult, TemplateUser, ResponseData } from '../types/user'
import { IUserLogin } from '@generals/Interfaces'
import { generateToken } from '@utils/jwt'
import AuthService from '@services/authService'

declare module 'express-session' {
    interface SessionData {
        jwt?: string
    }
}

class UserService {
    async getAllUsers(start: number, length: number, search: { value: string, regex: string }): Promise<IUserResponse> {
        const { data, recordsTotal, recordsFiltered } = await userRepository.findAll(start, length, search)

        const encryptedData = data.map(user => {
            const encryptedId = encrypt(user.id.toString());
            const createdAt = moment(user.createdAt).format("D MMMM YYYY");
            const updatedAt = moment(user.updatedAt).format("D MMMM YYYY");

            let userImage = user.image

            if (!user.image) {
                userImage = `default-profile.jpg`
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

        return {
            data: encryptedData,
            recordsTotal,
            recordsFiltered
        }
    }

    async getUserBydId(id: string): Promise<IUser | null> {
        const userId = decrypt(id)
        const user = userRepository.findById(userId)
        return user;
    }

    async verifyUser(username: string, password: string): Promise<IUserLogin> {
        const user = await userRepository.findByUsername(username)
        let result: IUserLogin

        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password)
            if (isPasswordValid) {
                return result = {
                    isUserValid: true,
                    data: user
                }
            }
        }

        return {
            isUserValid: false,
            data: null
        }
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

        let image = request.file.filename

        request.body.image = image

        const userData: Partial<IUser> = request.body;
        delete userData.id;

        userRepository.create(request.body)

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

    async bulkCreate(path: string): Promise<ResponseData> {
        return userRepository.bulkCreate(path)
    }

    async generateJwtToken(dataId: string | number, dataUsername: string): Promise<string> {
        let id = encrypt(dataId.toString())
        let username = encrypt(dataUsername)

        const payload = { id, username }
        const token = generateToken(payload)
        return token
    }

    async storeJwtToken(req: Request, res: Response, token: string): Promise<void> {
        req.session.jwt = token
    }
}

export default new UserService()