import { ValidationError } from "express-validator"

export type Book = {
    id: number
    price: number
    title: string
    description: string
    image: string
}

export type BookResult = { isError: boolean, errors: ValidationError[] }