import Menu, { IMenu } from "@models/backoffice/menus/menu";

class MenuRepository {
    async findAll(): Promise<IMenu[]> {
        return Menu.findAll()
    }
}

export default new MenuRepository()