import {Request, Response, NextFunction} from 'express'
import Menu from '@models/backoffice/menus/menu'
import Submenu from '@models/backoffice/submenus/submenu'
import User from '@models/backoffice/users/user';

const menuMiddleware = async(req: Request, res: Response, next: NextFunction) => {
    const excludedPaths = ["/public", "/img", "/backoffice/img", "/backoffice/usersTable", "/js", "/css", "/vendor"];
    if (excludedPaths.some((path) => req.originalUrl.startsWith(path))) {
      return next();
    }
    
    let dummyUserId = 11277;
    const basePath = req.originalUrl.split("?")[0];

    try {
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
                                where: {userId: dummyUserId},
                                attributes: []
                            },
                            required: true
                        }
                    ]
                },
            ]
        })

        res.locals.basePath = basePath
        res.locals.menus = menus

        next()
    } catch(error) {
        console.error('Error Get Menu', error)
        res.locals.menus = []
        next()
    }
}

export default menuMiddleware