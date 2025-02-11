import { Request, Response } from "express";
import { ValidationError } from "express-validator";
import puppeteer from "puppeteer";

import userService from '@services/userService';
import { User, TemplateUser } from '@customTypes/user'
import subMenuService from "@services/subMenuService";
import { logger } from "@utils/log";

export const getUsersDataTable = async (req: Request, res: Response) => {
  const start = parseInt(req.query.start as string, 10) || 0
  const length = parseInt(req.query.length as string, 10) || 0
  const search = req.query.search as { value: string, regex: string }

  const results = await userService.getAllUsers(start, length, search)

  res.json({
    draw: req.query.draw,
    recordsTotal: results.recordsTotal,
    recordsFiltered: results.recordsFiltered,
    data: results.data
  })
}

export const getUsers = (req: Request, res: Response) => {
  const flashMessage = req.flash("success");

  res.render("backoffice/users/index", {
    flashMessage
  });
};

export const userForm = async (_: Request, res: Response) => {
  const url = '/backoffice/users/saveuser'
  const user: User[] = [];
  const errors: ValidationError[] = []
  const subMenus = await subMenuService.getAllSubMenus()
  const userSubMenus: number[] = []
  const formType = 'create'
  const basePath = '/backoffice/users'
  res.render("backoffice/users/form", { url, user, errors, subMenus, basePath, userSubMenus, formType });
}

export const saveUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await userService.createUser(req)
    if (result.isError) {
      const url = '/backoffice/users/saveuser'
      const user: Object = result.data;
      const errors = result.errors
      const subMenus = await subMenuService.getAllSubMenus()
      const formType = 'create'
      const userSubMenus: number[] = []

      res.render("backoffice/users/form", { errors, url, user, subMenus, formType, userSubMenus });
    } else {
      req.flash("success", "Successfully add User");
      res.redirect('/backoffice/users')
    }
  } catch (error) {
    logger.info("Create User Failed", error)
    res.send(error)
  }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id
    await userService.deleteUser(userId)
    req.flash("success", "Successfully delete User")
    res.redirect('/backoffice/users')
  } catch (error) {
    res.send(error)
  }
}

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const url = '/backoffice/users/update'
    const formType = 'update'
    const userId = req.params.id
    const user = await userService.getUserBydId(userId)
    const subMenus = await subMenuService.getAllSubMenus()
    const userSubMenus: number[] = []
    user.submenu.forEach(submenu => {
      userSubMenus.push(submenu.id)
    })

    const userIdEncrypted = req.params.id
    const errors: ValidationError[] = []
    res.render("backoffice/users/form", { user, url, errors, userId: userIdEncrypted, subMenus, userSubMenus, formType })
  } catch (error) {
    res.send(error)
  }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    await userService.updateUser(req)
    req.flash("success", "Successfully update User")
    res.redirect('/backoffice/users')
  } catch (error) {
    res.send(error)
  }
}

export const template = async (_: Request, res: Response): Promise<void> => {
  const result: TemplateUser = await userService.download('user-template.csv')

  if (result.responseCode === 200) {
    res.download(result.data, 'user-template.csv');
  } else {
    res.send(result.data)
  }
}

export const importUser = async (_: Request, res: Response): Promise<void> => {
  res.render("backoffice/users/import")
}

export const saveImportUser = async (req: Request, res: Response): Promise<void> => {
  const response = await userService.bulkCreate(req.file.path)

  if (response.responseCode === 200) {
    req.flash("success", "Successfully import User")
    res.redirect('/backoffice/users')
  } else {
    res.send(response.responseMessage)
  }
}

export const exportUser = async (_: Request, res: Response) => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage()

  await page.setContent('<h1>Test PDF</h1>')
  const pdfBuffer = await page.pdf({format: 'A4'})

  await browser.close()

  res.setHeader('Content-Disposition', 'attachment; filename=output.pdf')
  res.setHeader('Content-Type', 'application/pdf')
  res.end(pdfBuffer)
}