import { Request, Response, NextFunction } from "express";

interface Privilege {
    submenuId: number
}

interface SubMenu {
    id: number
}

const isAuthorized = (req: Request, res: Response, next: NextFunction) => {
    const subMenu: SubMenu = res.locals.subMenu
    const privileges: Privilege[] = res.locals.privileges

    if(subMenu) {
        const idExists = privileges.some(item => item.submenuId === subMenu.id);
        if(idExists) {
            return next()
        }
        return res.render("backoffice/NotAuthorized")
    }

    next()
}

export default isAuthorized