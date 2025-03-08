import { Request, Response } from "express"
import userService from '@services/userService'
import { logger, logFormatter } from "@utils/log";

export const index = async (req: Request, res: Response) => {
    const flashMessage = req.flash("failed");

    if (req.session?.backoffice?.jwt) {
        return res.redirect('/backoffice/home')
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
        const logData = logFormatter("Login Successfully!", { data: result }, req.originalUrl)
        logger.info(logData)
        res.redirect('/backoffice/home')
    } else {
        const logData = logFormatter("Login Failed!", { data: result })
        logger.info(logData)
        req.flash("failed", "Invalid Username or Password")
        res.redirect('/backoffice')
    }
}

export const logout = (req: Request, res: Response) => {
    const token = req.session.backoffice.jwt
    req.session.destroy((err) => {
        if (err) {
            const logData = logFormatter("Logout Failed!", { data: err.message })
            logger.info(logData)
            console.log('test')
            return res.send("Failed to destroy session")
        }

        const logData = logFormatter("Logout Successfully!", { data: token })
        logger.info(logData)

        res.redirect('/backoffice')
    })
}
