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

class UserService {
    private logFatalError(operation: string, error: unknown, moduleUrl: string = ''): void {
        const details = error instanceof Error
            ? { message: error.message, stack: error.stack }
            : { message: String(error) }
        logger.error(logFormatter(`${operation} failed unexpectedly`, { error: details }, moduleUrl))
    }

    async getAllUsers(start: number, length: number, search: { value: string, regex: string }): Promise<IUserResponse> {
        try {
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

        const result = {
            data: encryptedData,
            recordsTotal,
            recordsFiltered
        }
        logger.info(logFormatter('Get users successfully', { recordsTotal, recordsFiltered }))
        return result
        } catch (error) {
            this.logFatalError('Get users', error)
            throw error
        }
    }

    async getUserBydId(id: string, isEncrypt: boolean = true): Promise<IUser | null> {
        try {
        let userId = id
        if (isEncrypt) {
            userId = decrypt(id)
        }

        const user = await userRepository.findById(userId)
        if (!user) {
            logger.warn(logFormatter('User not found', { isEncrypted: isEncrypt }))
        } else {
            logger.info(logFormatter('Get user successfully', { isEncrypted: isEncrypt }))
        }
        return user;
        } catch (error) {
            this.logFatalError('Get user by id', error)
            throw error
        }
    }

    async verifyUser(username: string, password: string): Promise<IUserLogin> {
        try {
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

                logger.info(logFormatter('User authentication succeeded'))
                return result
            }
        }

        logger.warn(logFormatter('User authentication failed', { userFound: Boolean(user) }))
        return {
            isUserValid: false,
            data: null
        }
        } catch (error) {
            this.logFatalError('Verify user credentials', error)
            throw error
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

            const { password, ...safeBody } = req.body

            const data = {
                results: {
                    ...results,
                    data: safeBody
                }
            }

            const logData = logFormatter("Error User Validation", data, req.originalUrl)
            logger.warn(logData)

            return results
        }

        // Profile photo is optional on the add user form.
        req.body.image = req.file?.filename ?? 'default-profile.jpg'

        const userData: Partial<IUser> = req.body;
        delete userData.id;

        let user: Record<string, any>
        try {
            user = await userRepository.create(req.body)
        } catch (error) {
            this.logFatalError('Create user', error, req.originalUrl)
            throw error
        }

        results = {
            isError: false,
            errors: [] as ValidationError[],
            data: user
        }

        logData = logFormatter("Create User Successfully!", { userId: user.id }, req.originalUrl)
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

            const logData = logFormatter("User update validation failed", { errors: results.errors }, req.originalUrl)
            logger.warn(logData)

            return results
        }

        if (req.file) {
            const image = req.file.filename
            req.body.image = image
        }

        try {
            const userId = decrypt(req.body.id)
            delete req.body.id
            const result = await userRepository.update(userId, req.body)

            if (Array.isArray(result)) {
                logData = logFormatter("Update User Successfully!", { affectedRows: result[0] }, req.originalUrl)
                logger.info(logData)
            } else {
                logger.warn(logFormatter("User update processing failed", { error: String(result) }, req.originalUrl))
            }
            return result
        } catch (error) {
            this.logFatalError('Update user', error, req.originalUrl)
            throw error
        }

    }

    async deleteUser(id: string): Promise<number> {
        try {
            const userId = decrypt(id)
            const result = await userRepository.delete(userId)
            logger.info(logFormatter("Delete user successfully", { affectedRows: result }))
            return result
        } catch (error) {
            this.logFatalError('Delete user', error)
            throw error
        }
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

            const logData = logFormatter("Download Successfully!",  result )
            logger.info(logData)

            return result
        } catch (err) {
            const result = {
                responseCode: 404,
                responseMessage: 'Not Found',
                data: err
            }

            const logData = logFormatter("Download failed!", result )
            logger.warn(logData)

            return result
        }
    }

    async bulkCreate(filePath: string): Promise<ResponseData> {
        try {
            const result = await userRepository.bulkCreate(filePath)
            if (result.responseCode === 200) {
                logger.info(logFormatter('Bulk user import queued successfully', { responseCode: result.responseCode }))
            } else {
                logger.warn(logFormatter('Bulk user import could not be queued', { responseCode: result.responseCode, responseMessage: String(result.responseMessage) }))
            }
            return result
        } catch (error) {
            this.logFatalError('Bulk create users', error)
            throw error
        }
    }

    async generateJwtToken(dataId: string | number, dataUsername: string): Promise<string> {
        try {
            const id = encrypt(dataId.toString())
            const username = encrypt(dataUsername)

            const payload = { id, username }
            const token = generateToken(payload)
            logger.info(logFormatter('JWT generated successfully', { userId: dataId }))
            return token
        } catch (error) {
            this.logFatalError('Generate JWT', error)
            throw error
        }
    }

    async storeJwtToken(req: Request, token: string): Promise<void> {
        try {
            if (!req.session.backoffice) req.session.backoffice = {}
            req.session.backoffice.jwt = token
            logger.info(logFormatter('JWT stored in backoffice session', {}, req.originalUrl))
        } catch (error) {
            this.logFatalError('Store JWT in session', error, req.originalUrl)
            throw error
        }
    }
}

export default new UserService()
