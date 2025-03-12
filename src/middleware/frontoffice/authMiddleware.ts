import { Request, Response, NextFunction } from 'express'
import { verifyToken } from "@utils/jwt";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    let url = req.url
    if (!url.includes("backoffice")) {

        const token = req.session.frontoffice?.jwt

        if (!token) {
            return res.redirect('/auth')
        }

        const decoded = verifyToken(token)
        if (!decoded) {
            req.session.destroy((err) => {
                if (err) {
                    console.error("Failed to destroy session", err)
                    return res.send("Failed to destroy session")
                }
            })
            return res.redirect('/auth')
        }
    }

    next()
}