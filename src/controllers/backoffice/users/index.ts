import { Request, Response, NextFunction } from "express";
import userService from '../../../services/userService';
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  const flashMessage = req.flash("success");
  const users = await userService.getAllUsers()
  res.render("backoffice/users/index", {
    users,
    flashMessage
  });
};

export const userForm = (req: Request, res: Response, next: NextFunction) => {
  const url = '/backoffice/users/saveuser'
  res.render("backoffice/users/form", { url });
}

export const saveUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await userService.createUser(req.body)
    req.flash("success", "Successfully add User");
    res.redirect('/backoffice/users')
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
    res.render("backoffice/users/form", { user, url, userId: userIdEncrypted })
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