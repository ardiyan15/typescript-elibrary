import { Request, Response } from "express";
export const index = (_: Request, res: Response) => {
    res.render("frontoffice/auth/index");
};

export const login = (_: Request, res: Response) => {
    res.send('login process')
}