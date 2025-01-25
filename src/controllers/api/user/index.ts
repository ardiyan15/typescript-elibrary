import { Request, Response } from "express"

export const index = (_req: Request, res: Response) => {
    res.json({
        message: "Hello Swagger"
    })
}