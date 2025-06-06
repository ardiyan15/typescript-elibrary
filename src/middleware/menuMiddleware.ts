import { Request, Response, NextFunction } from 'express'
import Menu from '@models/backoffice/menus/menu'
import Submenu from '@models/backoffice/submenus/submenu'
import User from '@models/backoffice/users/user';
import AuthService from '@services/authService';
import Privilege from '@models/backoffice/privileges/privileges';

const menuMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const excludedPaths = ["/public", "/img", "/backoffice/img", "/backoffice/usersTable", "/js", "/css", "/vendor"];
    if (excludedPaths.some((path) => req.originalUrl.startsWith(path))) {
        return next();
    }

    try {
        let url = req.url

        if (url.includes("backoffice")) {
            const token = req.session?.backoffice?.jwt
            const Auth = new AuthService(token)

            const userId = Auth.getUser().id
            const basePath = req.originalUrl.split("?")[0];
            const menus = await Menu.findAll({
                include: [
                    {
                        model: Submenu,
                        as: 'submenus',
                        required: true,
                        include: [
                            {
                                model: User,
                                as: 'user',
                                through: {
                                    where: { userId },
                                    attributes: []
                                },
                                required: true
                            }
                        ]
                    },
                ]
            })

            const subMenu = await Submenu.findOne({ where: { url: basePath }, attributes: ['id'], raw: true })
            const privileges = await Privilege.findAll({ where: { userId }, raw: true })

            res.locals.basePath = basePath
            res.locals.menus = menus
            res.locals.subMenu = subMenu
            res.locals.privileges = privileges
            res.locals.auth = Auth
        }

        next()
    } catch (error) {
        console.error('Error Get Menu', error)
        res.locals.menus = []
        next()
    }
}

export default menuMiddleware