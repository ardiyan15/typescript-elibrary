import Menu from "@models/backoffice/menus/menu";
import Submenu, { ISubMenu } from "@models/backoffice/submenus/submenu";

class SubMenuRepository {
    async findAll(): Promise<ISubMenu[]> {
        return Submenu.findAll({
            include: [
                {
                    model: Menu,
                    as: 'menu'
                }
            ]
        })
    }
}

export default new SubMenuRepository