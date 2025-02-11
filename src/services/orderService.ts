import { Request } from "express";
import { logger, logFormatter } from "@utils/log";
import orderRepository from "@repositories/orderRepository";
import bookRepository from "@repositories/bookRepository";
import { GenerateTrxId } from "@helper/GenerateTrxId"

class OrderService {
    async createOrder(req: Request) {
        try {

            let logData = logFormatter("Receive Order Input!", { data: req.body }, req.originalUrl)
            logger.info(logData)

            const fullname = req.body.fullname
            const address = req.body.address
            const bookIds = req.body.bookId
            const bookIdData = bookIds.split(",")

            const books = await bookRepository.findBookById(bookIdData)

            if (books.length === 0) {
                const resultData = {
                    responseCode: 404,
                    responseMessage: 'Failed',
                    data: {
                        message: 'Item Not Found'
                    }
                }

                return resultData
            }
            const transactionId = await GenerateTrxId()

            const totalPrice: number = books.reduce((sum, book) => sum + Number(book.price), 0)

            const orderData = {
                fullname: fullname,
                address: address,
                transactionId: transactionId,
                quantity: books.length,
                totalPrice: totalPrice,
                paymentStatus: 'unpaid',
                orderDetails: {
                    books
                }
            }

            const order = await orderRepository.create(orderData)
            const { result, data } = order

            if (result) {
                logData = logFormatter("Create Order Successfully!", data, req.originalUrl)
                logger.info(logData)
            } else {
                logData = logFormatter("Create Order Failed!", data, req.originalUrl)
                logger.error(logData)
            }

            const resultData = {
                responseCode: 200,
                responseMessage: 'Success',
                data: order
            }

            return resultData

        } catch (error) {
            const logData = logFormatter("Internal Server Error", error.stack, req.originalUrl)
            logger.error(logData)
            const resultData = {
                responseCode: 500,
                responseMessage: 'Failed',
                data: {
                    message: "Internal Server Error"
                }
            }

            return resultData
        }
    }
}

export default new OrderService()