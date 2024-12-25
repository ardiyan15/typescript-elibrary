import Menu, { IMenu } from "@models/backoffice/menus/menu";
import Submenu from "@models/backoffice/submenus/submenu";

class MenuRepository {
    async findAll(): Promise<IMenu[]> {
        return Menu.findAll()
    }
}

export default new MenuRepository