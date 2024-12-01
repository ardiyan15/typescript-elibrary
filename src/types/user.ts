import { ValidationError } from "express-validator"

export type User = {
    id: string
    name: string
    email: string
    role: string
    photo: string
}

export type CreateUserResult = { isError: boolean, errors: ValidationError[] }
export type TemplateUser = {
    responseCode: number
    responseMessage: string
    data?: any
}

export type Response = {
    responseCode: number
    responseMessage: string
}

export type MessageType = {
    messageType: string
    path: string
}