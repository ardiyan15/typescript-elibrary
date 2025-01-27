import orderService from "@services/orderService"
import { Request, Response } from "express"

export const orderBook = async (req: Request, res: Response) => {
    const { responseCode, responseMessage, data } = await orderService.createOrder(req)

    res.status(responseCode).json({
        responseCode,
        responseMessage,
        data
    })
}