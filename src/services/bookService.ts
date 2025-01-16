import { Request } from 'express'
import { validationResult, ValidationError } from "express-validator";
import moment from "moment";

import { BookResult } from '@customTypes/book';
import bookRepository from '@repositories/bookRepository';
import { IBook, IBookResponse } from '@models/backoffice/books/book';
import { encrypt, decrypt } from "@utils/secure";


class BookService {

    async getBooks(start: number, length: number, search: { value: string, regex: string }): Promise<IBookResponse> {
        const { data, recordsTotal, recordsFiltered } = await bookRepository.findAll(start, length, search)

        const encryptedData = data.map(book => {
            const encryptedId = encrypt(book.id.toString());
            const createdAt = moment(book.createdAt).format("D MMMM YYYY");
            const updatedAt = moment(book.updatedAt).format("D MMMM YYYY");

            let bookImage = book.image

            if (!book.image) {
                bookImage = `default-profile.jpg`
            }

            return {
                id: encryptedId,
                title: book.title,
                description: book.description,
                image: bookImage,
                category: book.category,
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

    getBook(id: string): Promise<IBook | null> {
        const bookId = decrypt(id)
        const book = bookRepository.findById(bookId)
        return book
    }

    createUser(req: Request) {
        const errors = validationResult(req)

        let results: BookResult

        if (!errors.isEmpty()) {
            results = {
                isError: true,
                errors: errors.array()
            }
            return results
        }

        const image = req.file.filename
        req.body.image = image

        delete req.body.id

        bookRepository.create(req.body)

        results = {
            isError: false,
            errors: [] as ValidationError[]
        }

        return results

    }

    async updateBook(req: Request): Promise<[number] | BookResult> {
        const errors = validationResult(req)

        let results: BookResult

        if (!errors.isEmpty()) {
            results = {
                isError: true,
                errors: errors.array()
            }
            return results
        }

        if (req.file) {
            const image = req.file.filename
            req.body.image = image
        }

        const bookId = decrypt(req.body.id)
        delete req.body.id
        return bookRepository.update(bookId, req.body)
    }

    async deleteBook(id: string): Promise<number> {
        const bookId = decrypt(id)
        return bookRepository.delete(bookId)
    }
}

export default new BookService()