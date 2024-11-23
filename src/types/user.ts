import { ValidationError } from "express-validator"

export type User = {
    id: string
    name: string
    email: string
    role: string
    photo: string
}

export type CreateUserResult = { isError: boolean, errors: ValidationError[] }