import { Request, Response } from 'express'
import { ValidationError } from "express-validator";
import userService from '@services/userService';
import profileService from '@services/profileService';

export const index = async (req: Request, res: Response) => {
    const flashMessage = req.flash("success");

    const Auth = res.locals.auth
    const userId = Auth.getUser().id

    const result = await userService.getUserBydId(userId, false)
    const basePath = '/backoffice/profile'

    res.render("backoffice/profiles/index", {
        flashMessage,
        result,
        basePath
    });
};

export const edit = async (_req: Request, res: Response) => {
    const Auth = res.locals.auth
    const userId = Auth.getUser().id
    const errors: ValidationError[] = []
    const basePath = '/backoffice/profile'

    const user = await userService.getUserBydId(userId, false)
    res.render("backoffice/profiles/form", {
        user,
        errors,
        basePath
    })
}

export const update = async (req: Request, res: Response) => {
    try {
        await profileService.updateUser(req)
        req.flash("success", "Successfully update User")
        res.redirect('/backoffice/profile')
    } catch (error) {
        res.send(error)
    }
}