import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@utils/jwt";

const destroySession = (req: Request, res: Response, next: NextFunction, callback: () => void): void => {
    req.session.destroy((err) => {
        if (err) {
            return next(err)
        }

        res.clearCookie("connect.sid", {
            path: "/"
        })

        callback()
    })
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    let url = req.url
    if (url.includes("backoffice")) {

        const token = req.session.backoffice?.jwt

        if (!token) {
            return res.redirect('/backoffice')
        }

        try {

            const decoded = verifyToken(token)
            if (decoded) {
                return next()
            }

        } catch {
            // Token invalid atau kedaluwarsa.
        }

        return destroySession(req, res, next, () => res.redirect("/backoffice"))
    }
}

export const redirectIfAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const token = req.session?.backoffice?.jwt;

    if (!token) {
        return next();
    }

    try {
        const decoded = verifyToken(token);

        if (decoded) {
            return res.redirect("/backoffice/home");
        }
    } catch {
        // Token invalid atau kedaluwarsa.
    }

    return destroySession(req, res, next, () => next());
};