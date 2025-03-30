import { Request, Response } from "express";
import bookService from '@services/bookService';

export const getHome = async (req: Request, res: Response) => {
    const start = 0
    const length = 4;
    const search = req.query.search as { value: string, regex: string }

    const { data } = await bookService.getBooks(start, length, search)

    res.render("frontoffice/home/index", { data });
};

export const detail = async (_: Request, res: Response) => {
    res.render("frontoffice/home/detail");
}