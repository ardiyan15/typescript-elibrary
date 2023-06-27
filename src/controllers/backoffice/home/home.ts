import { RequestHandler } from "express";

export const getHome: RequestHandler = (req, res, next) => {
  res.render("backoffice/home/index");
};
