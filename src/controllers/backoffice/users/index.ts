import { Request, Response, NextFunction } from "express";
import { ValidationError } from "express-validator";

import userService from '@services/userService';
import { User, TemplateUser } from '../../../types/user'
import subMenuService from "@services/subMenuService";

export const getUsersDataTable = async (req: Request, res: Response, next: NextFunction) => {
  const start = parseInt(req.query.start as string) || 0
  const length = parseInt(req.query.length as string) || 0
  const search = req.query.search as { value: string, regex: string }

  const results = await userService.getAllUsers(start, length, search)

  res.json({
    draw: req.query.draw,
    recordsTotal: results.recordsTotal,
    recordsFiltered: results.recordsFiltered,
    data: results.data
  })
}

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  const flashMessage = req.flash("success");

  res.render("backoffice/users/index", {
    flashMessage
  });
};

export const userForm = async (req: Request, res: Response, next: NextFunction) => {
  const url = '/backoffice/users/saveuser'
  const user: User[] = [];
  const errors: ValidationError[] = []
  const subMenus = await subMenuService.getAllSubMenus()
  const basePath = '/backoffice/users'
  res.render("backoffice/users/form", { url, user, errors, subMenus, basePath });
}

export const saveUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await userService.createUser(req)
    if (result.isError) {
      const url = '/backoffice/users/saveuser'
      const user: User[] = [];
      const errors = result.errors
      const subMenus = await subMenuService.getAllSubMenus()

      res.render("backoffice/users/form", { errors, url, user, subMenus });
    } else {
      req.flash("success", "Successfully add User");
      res.redirect('/backoffice/users')
    }
  } catch (error) {
    res.send(error)
  }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.body.userId
    await userService.deleteUser(userId)
    req.flash("success", "Successfully delete User")
    res.redirect('/backoffice/users')
  } catch (error) {
    res.send(error)
  }
}

export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const url = '/backoffice/users/update'
    const userId = req.params.id
    const user = await userService.getUserBydId(userId)
    const userIdEncrypted = req.params.id
    const errors: ValidationError[] = []
    res.render("backoffice/users/form", { user, url, errors, userId: userIdEncrypted })
  } catch (error) {
    res.send(error)
  }
}

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.body.id
    await userService.updateUser(userId, req.body)
    req.flash("success", "Successfully update User")
    res.redirect('/backoffice/users')
  } catch (error) {
    res.send(error)
  }
}

export const template = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const result: TemplateUser = await userService.download('user-template.csv')

  if (result.responseCode === 200) {
    res.download(result.data, 'user-template.csv');
  } else {
    res.send(result.data)
  }
}

export const importUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  res.render("backoffice/users/import")
}

export const saveImportUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const response = await userService.bulkCreate(req.file.path)

  if (response.responseCode == 200) {
    req.flash("success", "Successfully import User")
    res.redirect('/backoffice/users')
  } else {
    res.send(response.responseMessage)
  }
}