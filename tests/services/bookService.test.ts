import { validationResult } from "express-validator"

import bookService from "../../src/services/bookService"
import bookRepository from "../../src/repositories/bookRepository"
import { encrypt, decrypt } from "../../src/utils/secure"
import { logger } from "../../src/utils/log"

jest.mock("../../src/repositories/bookRepository")
jest.mock("../../src/utils/secure", () => ({
    encrypt: jest.fn(),
    decrypt: jest.fn()
}))
jest.mock("express-validator", () => ({
    validationResult: jest.fn()
}))
jest.mock("../../src/utils/log", () => ({
    logger: { info: jest.fn(), error: jest.fn() },
    logFormatter: jest.fn(() => ({}))
}))

const mockValidation = (errors: any[] = []) => {
    ;(validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => errors.length === 0,
        array: () => errors
    })
}

describe("BookService - getBooks", () => {
    beforeEach(() => jest.clearAllMocks())

    it("returns formatted books with encrypted IDs and a fallback image", async () => {
        const createdAt = new Date("2024-01-02T00:00:00.000Z")
        const updatedAt = new Date("2024-02-03T00:00:00.000Z")
        ;(bookRepository.findAll as jest.Mock).mockResolvedValue({
            data: [{ id: 7, title: "Book", description: "Details", price: 12000, image: null, category: "Novel", createdAt, updatedAt }],
            recordsTotal: 1,
            recordsFiltered: 1
        })
        ;(encrypt as jest.Mock).mockReturnValue("encrypted-7")

        const result = await bookService.getBooks(0, 10, { value: "Book", regex: "false" })

        expect(bookRepository.findAll).toHaveBeenCalledWith(0, 10, { value: "Book", regex: "false" })
        expect(encrypt).toHaveBeenCalledWith("7")
        expect(result).toEqual({
            data: [{ id: "encrypted-7", title: "Book", description: "Details", price: 12000,
                image: "default-profile.jpg", category: "Novel", createdAt: "2 January 2024", updatedAt: "3 February 2024" }],
            recordsTotal: 1,
            recordsFiltered: 1
        })
    })

    it("keeps the existing image", async () => {
        ;(bookRepository.findAll as jest.Mock).mockResolvedValue({
            data: [{ id: 8, title: "Book", description: "Details", price: 1, image: "cover.png", category: "Novel", createdAt: "2024-01-01", updatedAt: "2024-01-01" }],
            recordsTotal: 1, recordsFiltered: 1
        })
        ;(encrypt as jest.Mock).mockReturnValue("enc")

        const result = await bookService.getBooks(0, 5, { value: "", regex: "false" })

        expect(result.data[0].image).toBe("cover.png")
    })
})

describe("BookService - getBook", () => {
    beforeEach(() => jest.clearAllMocks())

    it("decrypts the ID and returns the matching book", async () => {
        const book = { id: 7, title: "Book" }
        ;(decrypt as jest.Mock).mockReturnValue("7")
        ;(bookRepository.findById as jest.Mock).mockResolvedValue(book)

        await expect(bookService.getBook("encrypted-7")).resolves.toBe(book)
        expect(decrypt).toHaveBeenCalledWith("encrypted-7")
        expect(bookRepository.findById).toHaveBeenCalledWith("7")
    })
})

describe("BookService - createBook", () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockValidation()
    })

    it("returns validation errors without creating a book", () => {
        const errors = [{ msg: "Title is required" }]
        mockValidation(errors)
        const req: any = { originalUrl: "/books", body: { title: "" }, file: undefined }

        const result = bookService.createBook(req)

        expect(result).toEqual({ isError: true, errors })
        expect(bookRepository.create).not.toHaveBeenCalled()
        expect(logger.error).toHaveBeenCalled()
    })

    it("sets the uploaded image, removes the submitted ID, and creates the book", () => {
        const req: any = {
            originalUrl: "/books",
            body: { id: "client-id", title: "Book" },
            file: { filename: "cover.png" }
        }

        const result = bookService.createBook(req)

        expect(req.body).toEqual({ title: "Book", image: "cover.png" })
        expect(bookRepository.create).toHaveBeenCalledWith({ title: "Book", image: "cover.png" })
        expect(result).toEqual({ isError: false, errors: [] })
        expect(logger.info).toHaveBeenCalled()
    })
})

describe("BookService - updateBook", () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockValidation()
    })

    it("returns validation errors without updating", async () => {
        const errors = [{ msg: "Invalid title" }]
        mockValidation(errors)
        const req: any = { body: { id: "encrypted-7", title: "" } }

        await expect(bookService.updateBook(req)).resolves.toEqual({ isError: true, errors })
        expect(bookRepository.update).not.toHaveBeenCalled()
    })

    it("decrypts the ID, removes it from the body, and includes a newly uploaded image", async () => {
        ;(decrypt as jest.Mock).mockReturnValue("7")
        ;(bookRepository.update as jest.Mock).mockResolvedValue([1])
        const req: any = {
            body: { id: "encrypted-7", title: "Updated" },
            file: { filename: "new-cover.png" }
        }

        await expect(bookService.updateBook(req)).resolves.toEqual([1])
        expect(req.body).toEqual({ title: "Updated", image: "new-cover.png" })
        expect(bookRepository.update).toHaveBeenCalledWith("7", { title: "Updated", image: "new-cover.png" })
    })

    it("updates without replacing the image when no file is uploaded", async () => {
        ;(decrypt as jest.Mock).mockReturnValue("9")
        ;(bookRepository.update as jest.Mock).mockResolvedValue([1])
        const req: any = { body: { id: "encrypted-9", title: "Updated" } }

        await bookService.updateBook(req)

        expect(bookRepository.update).toHaveBeenCalledWith("9", { title: "Updated" })
    })
})

describe("BookService - deleteBook", () => {
    beforeEach(() => jest.clearAllMocks())

    it("decrypts the ID and returns the repository delete count", async () => {
        ;(decrypt as jest.Mock).mockReturnValue("7")
        ;(bookRepository.delete as jest.Mock).mockResolvedValue(1)

        await expect(bookService.deleteBook("encrypted-7")).resolves.toBe(1)
        expect(decrypt).toHaveBeenCalledWith("encrypted-7")
        expect(bookRepository.delete).toHaveBeenCalledWith("7")
    })
})
