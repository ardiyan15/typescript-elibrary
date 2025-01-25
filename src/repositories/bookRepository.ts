import { Op } from "sequelize";
import sequelize from "@utils/connection"
import Book, { IBook } from "@models/backoffice/books/book"
import { IDataTableResponse } from "@generals/Interfaces"


class BookRepository {
    async findAll(start: number, length: number, search: { value: string, regex: string }): Promise<IDataTableResponse<IBook>> {
        const searchValue = search?.value || '';
        const whereCondition = searchValue ? { username: { [Op.like]: `%${searchValue}%` } } : {}

        const { rows, count } = await Book.findAndCountAll({
            where: whereCondition,
            offset: start,
            limit: length,
            order: [['id', 'DESC']],
        })

        return {
            data: rows,
            recordsTotal: count,
            recordsFiltered: count,
        };
    }

    async findById(id: string): Promise<IBook | null> {
        return Book.findByPk(id)
    }

    async create(data: IBook) {
        const transaction = await sequelize.transaction()
        try {
            const book = await Book.create(data, { transaction })
            await transaction.commit()
            return book
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }

    async delete(id: string): Promise<number> {
        return Book.destroy({ where: { id } })
    }

    async update(id: string, book: Partial<IBook>): Promise<[number]> {

        const updateData: IBook = {
            title: book.title,
            category: book.category,
            description: book.description,
            price: book.price
        }

        if (book.image) {
            updateData.image = book.image
        }

        const transaction = await sequelize.transaction()

        try {
            const book = await Book.update(updateData, { where: { id }, transaction });

            await transaction.commit()
            return book
        } catch (error) {
            await transaction.rollback()
            return error
        }
    }
}

export default new BookRepository()