import { Request, Response } from "express";
export const index = (_: Request, res: Response) => {
    res.render("frontoffice/cart/index");
};

export const add = (_: Request, res: Response) => {
    res.send('ok')
}