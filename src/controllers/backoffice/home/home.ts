import { Request, Response } from "express";
export const getHome = (_: Request, res: Response) => {
  res.render("backoffice/home/index");
};
