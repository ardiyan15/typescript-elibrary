import { Request, Response } from "express";
export const index = (_: Request, res: Response) => {
    res.render("frontoffice/cart/index");
};
