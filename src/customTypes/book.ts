import { ValidationError } from "express-validator"

export type Book = {
    title: string
    description: string
    image: string
    category: string
}

export type BookResult = { isError: boolean, errors: ValidationError[] }