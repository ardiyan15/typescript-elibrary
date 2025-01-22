import { ValidationError } from "express-validator"

export type User = {
    id: string
    name: string
    email: string
    role: string
    photo: string
}

export type UserResult = { isError: boolean, errors: ValidationError[], data: User | Record<string, any> | [] }
export type TemplateUser = {
    responseCode: number
    responseMessage: string
    data?: any
}

export type ResponseData = {
    responseCode: number
    responseMessage: string
}

export type MessageType = {
    messageType: string
    path: string
}