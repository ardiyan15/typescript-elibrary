import { Request, Response, NextFunction } from "express"
import userService from '@services/userService'
import { regenerateSession, saveSession } from "@helper/session";
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

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { username, password } = req.body

        const result = await userService.verifyUser(username, password)

        if (result.isUserValid && result.data) {
            const token = await userService.generateJwtToken(result.data.id, result.data.username)

            await regenerateSession(req)

            await userService.storeJwtToken(req, token)
            await saveSession(req)

            res.redirect('/backoffice/home')
        } else {
            req.flash("failed", "Invalid Username or Password")
            res.redirect('/backoffice')
        }

    } catch (error) {
        return next(error)
    }

}

export const logout = (req: Request, res: Response, next: NextFunction) => {
    req.session.destroy((err) => {
        if (err) {
            logger.error(
                logFormatter(
                    "Logout Failed!",
                    { error: err.message },
                    req.originalUrl
                )
            );

            return next(err);
        }

        res.clearCookie("connect.sid", {
            path: "/",
        });

        logger.info(
            logFormatter(
                "Logout Successfully!",
                {},
                req.originalUrl
            )
        );

        return res.redirect("/backoffice");
    });
};
