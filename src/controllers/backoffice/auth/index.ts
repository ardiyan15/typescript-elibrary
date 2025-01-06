import { Request, Response } from "express"
import userService from '@services/userService'

export const index = async (req: Request, res: Response) => {
    const flashMessage = req.flash("failed");

    if(req.session.jwt) {
        return res.redirect('/backoffice')
    }

    res.render('backoffice/auth', {
        flashMessage
    })
}

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body

    const result = await userService.verifyUser(username, password)

    if (result.isUserValid) {
        const token = await userService.generateJwtToken(result.data.id, result.data.username)
        await userService.storeJwtToken(req, token)
        res.redirect('/backoffice/home')
    } else {
        req.flash("failed", "Invalid Username or Password")
        res.redirect('/backoffice')
    }
}

export const logout = (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Failed to destroy session", err)
            return res.send("Failed to destroy session")
        }

        res.redirect('/backoffice')
    })
}
