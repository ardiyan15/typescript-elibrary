import { Request } from "express";
import { promises as fsPromises } from "fs";
import path from "path";
import { validationResult, ValidationError } from "express-validator";
import moment from "moment";
import bcrypt from 'bcrypt'

import userRepository from "@repositories/userRepository";
import { IUser, IUserResponse } from '@models/backoffice/users/user';
import { decrypt, encrypt } from "@utils/secure";
import { UserResult, TemplateUser, ResponseData } from '@customTypes/user'
import { IUserLogin } from '@generals/Interfaces'
import { generateToken } from '@utils/jwt'
import { logger, logFormatter } from "@utils/log";

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

    async getUserBydId(id: string, isEncrypt: boolean = true): Promise<IUser | null> {
        let userId = id
        if (isEncrypt) {
            userId = decrypt(id)
        }

        const user = await userRepository.findById(userId)
        return user;
    }

    async verifyUser(username: string, password: string): Promise<IUserLogin> {
        const user = await userRepository.findByUsername(username)
        let result: IUserLogin

        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password)
            if (isPasswordValid) {
                delete user.password
                result = {
                    isUserValid: true,
                    data: user
                }

                return result
            }
        }

        return {
            isUserValid: false,
            data: null
        }
    }

    async createUser(req: Request): Promise<UserResult> {
        let logData = logFormatter("Receive Create User Input!", { data: {} }, req.originalUrl)
        logger.info(logData)

        const errors = validationResult(req)

        let results: UserResult
        if (!errors.isEmpty()) {
            results = {
                isError: true,
                errors: errors.array(),
                data: req.body
            }

            const data = { results }

            const logData = logFormatter("Error User Validation", data, req.originalUrl)
            logger.error(logData)

            return results
        }

        const image = req.file.filename

        req.body.image = image

        const userData: Partial<IUser> = req.body;
        delete userData.id;

        const user = await userRepository.create(req.body)

        results = {
            isError: false,
            errors: [] as ValidationError[],
            data: user
        }

        const data = { results }

        logData = logFormatter("Create User Successfully!", data, req.originalUrl)
        logger.info(logData)

        return results

    }

    async updateUser(req: Request): Promise<[number] | UserResult> {
        let logData = logFormatter("Receive User Input Update!", { data: {} }, req.originalUrl)
        logger.info(logData)

        const errors = validationResult(req)

        let results: UserResult

        if (!errors.isEmpty()) {
            results = {
                isError: true,
                errors: errors.array(),
                data: []
            }

            const data = { results }

            const logData = logFormatter("Error User Validation Update", data, req.originalUrl)
            logger.error(logData)

            return results
        }

        if (req.file) {
            const image = req.file.filename
            req.body.image = image
        }

        const userId = decrypt(req.body.id)
        delete req.body.id
        const result = await userRepository.update(userId, req.body)

        logData = logFormatter("Update User Successfully!", results, req.originalUrl)
        logger.info(logData)

        return result

    }

    async deleteUser(id: string): Promise<number> {
        const userId = decrypt(id)
        const result = await userRepository.delete(userId)
        const logData = logFormatter("Delete User Successfully!", { data: result })
        logger.info(logData)

        return result
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

            const logData = logFormatter("Download Successfully!", { data: result })
            logger.info(logData)

            return result
        } catch (err) {
            const result = {
                responseCode: 404,
                responseMessage: 'Not Found',
                data: err
            }

            const logData = logFormatter("Download failed!", { data: result })
            logger.error(logData)

            return result
        }
    }

    async bulkCreate(filePath: string): Promise<ResponseData> {
        return userRepository.bulkCreate(filePath)
    }

    async generateJwtToken(dataId: string | number, dataUsername: string): Promise<string> {
        const id = encrypt(dataId.toString())
        const username = encrypt(dataUsername)

        const payload = { id, username }
        const token = generateToken(payload)
        return token
    }

    async storeJwtToken(req: Request, token: string): Promise<void> {
        req.session.jwt = token
    }
}

export default new UserService()