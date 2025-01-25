import { Request, Response } from "express"

export const orderBook = (req: Request, res: Response) => {
    console.log(req.body)
    res.json({
        responseCode: 200,
        responseMessage: 'success',
        data: []
    })
}