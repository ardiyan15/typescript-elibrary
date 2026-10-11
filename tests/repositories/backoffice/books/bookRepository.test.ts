import { Op } from "sequelize"

import bookRepository from "../../../../src/repositories/bookRepository"
import Book from "../../../../src/models/backoffice/books/book"
import sequelize from "../../../../src/utils/connection"

jest.mock("../../../../src/models/backoffice/books/book", () => ({
    __esModule: true,
    default: {
        findAndCountAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
        destroy: jest.fn(),
        update: jest.fn(),
        findAll: jest.fn()
    }
}))

jest.mock("../../../../src/utils/connection", () => ({
    __esModule: true,
    default: { transaction: jest.fn() }
}))

describe("BookRepository - findAll", () => {
    beforeEach(() => jest.clearAllMocks())

    it("returns books with pagination when no search is provided", async () => {
        const books = [{ id: 2, title: "Second" }, { id: 1, title: "First" }]
        ;(Book.findAndCountAll as jest.Mock).mockResolvedValue({ rows: books, count: 2 })

        const result = await bookRepository.findAll(0, 10, { value: "", regex: "false" })

        expect(result).toEqual({ data: books, recordsTotal: 2, recordsFiltered: 2 })
        expect(Book.findAndCountAll).toHaveBeenCalledWith({
            where: {}, offset: 0, limit: 10, order: [["id", "DESC"]]
        })
    })

    it("filters books by title when a search value is provided", async () => {
        const books = [{ id: 1, title: "History" }]
        ;(Book.findAndCountAll as jest.Mock).mockResolvedValue({ rows: books, count: 1 })

        const result = await bookRepository.findAll(5, 15, { value: "Hist", regex: "false" })

        expect(result).toEqual({ data: books, recordsTotal: 1, recordsFiltered: 1 })
        expect(Book.findAndCountAll).toHaveBeenCalledWith({
            where: { title: { [Op.like]: "%Hist%" } },
            offset: 5,
            limit: 15,
            order: [["id", "DESC"]]
        })
    })
})

describe("BookRepository - findById", () => {
    beforeEach(() => jest.clearAllMocks())

    it("returns the book found by primary key", async () => {
        const book = { id: 4, title: "Book" }
        ;(Book.findByPk as jest.Mock).mockResolvedValue(book)

        await expect(bookRepository.findById("4")).resolves.toBe(book)
        expect(Book.findByPk).toHaveBeenCalledWith("4")
    })

    it("returns null when the book does not exist", async () => {
        ;(Book.findByPk as jest.Mock).mockResolvedValue(null)

        await expect(bookRepository.findById("404")).resolves.toBeNull()
        expect(Book.findByPk).toHaveBeenCalledWith("404")
    })
})

describe("BookRepository - create", () => {
    const transaction = { commit: jest.fn(), rollback: jest.fn() }

    beforeEach(() => {
        jest.clearAllMocks()
        ;(sequelize.transaction as jest.Mock).mockResolvedValue(transaction)
    })

    it("creates a book and commits the transaction", async () => {
        const data = { title: "Book", category: "Novel", description: "Description", price: 100 }
        const createdBook = { id: 3, ...data }
        ;(Book.create as jest.Mock).mockResolvedValue(createdBook)

        await expect(bookRepository.create(data as any)).resolves.toBe(createdBook)
        expect(sequelize.transaction).toHaveBeenCalledTimes(1)
        expect(Book.create).toHaveBeenCalledWith(data, { transaction })
        expect(transaction.commit).toHaveBeenCalledTimes(1)
        expect(transaction.rollback).not.toHaveBeenCalled()
    })

    it("rolls back and rethrows when creation fails", async () => {
        const error = new Error("create failed")
        ;(Book.create as jest.Mock).mockRejectedValue(error)

        await expect(bookRepository.create({ title: "Book" } as any)).rejects.toThrow(error)
        expect(transaction.rollback).toHaveBeenCalledTimes(1)
        expect(transaction.commit).not.toHaveBeenCalled()
    })
})

describe("BookRepository - delete", () => {
    beforeEach(() => jest.clearAllMocks())

    it("returns the number of deleted books", async () => {
        ;(Book.destroy as jest.Mock).mockResolvedValue(1)

        await expect(bookRepository.delete("4")).resolves.toBe(1)
        expect(Book.destroy).toHaveBeenCalledWith({ where: { id: "4" } })
    })

    it("returns zero when no book was deleted", async () => {
        ;(Book.destroy as jest.Mock).mockResolvedValue(0)

        await expect(bookRepository.delete("404")).resolves.toBe(0)
        expect(Book.destroy).toHaveBeenCalledWith({ where: { id: "404" } })
    })
})

describe("BookRepository - update", () => {
    const transaction = { commit: jest.fn(), rollback: jest.fn() }

    beforeEach(() => {
        jest.clearAllMocks()
        ;(sequelize.transaction as jest.Mock).mockResolvedValue(transaction)
    })

    it("updates book fields including image and commits", async () => {
        const updateData = {
            title: "Updated", category: "Novel", description: "New description", price: 250, image: "cover.png"
        }
        ;(Book.update as jest.Mock).mockResolvedValue([1])

        await expect(bookRepository.update("4", updateData)).resolves.toEqual([1])
        expect(Book.update).toHaveBeenCalledWith(updateData, { where: { id: "4" }, transaction })
        expect(transaction.commit).toHaveBeenCalledTimes(1)
        expect(transaction.rollback).not.toHaveBeenCalled()
    })

    it("omits image from update data when no new image is supplied", async () => {
        ;(Book.update as jest.Mock).mockResolvedValue([1])

        await bookRepository.update("4", {
            title: "Updated", category: "Novel", description: "New description", price: 250
        })

        expect(Book.update).toHaveBeenCalledWith({
            title: "Updated", category: "Novel", description: "New description", price: 250
        }, { where: { id: "4" }, transaction })
    })

    it("rolls back and returns the error when update fails", async () => {
        const error = new Error("update failed")
        ;(Book.update as jest.Mock).mockRejectedValue(error)

        await expect(bookRepository.update("4", { title: "Updated" })).resolves.toBe(error)
        expect(transaction.rollback).toHaveBeenCalledTimes(1)
        expect(transaction.commit).not.toHaveBeenCalled()
    })
})

describe("BookRepository - findBookById", () => {
    beforeEach(() => jest.clearAllMocks())

    it("returns selected fields for the requested book IDs", async () => {
        const books = [{ id: 1, title: "Book", price: 100 }]
        ;(Book.findAll as jest.Mock).mockResolvedValue(books)

        await expect(bookRepository.findBookById(["1", "2"])).resolves.toBe(books)
        expect(Book.findAll).toHaveBeenCalledWith({
            attributes: ["id", "price", "title"],
            where: { id: { [Op.in]: ["1", "2"] } }
        })
    })
})
