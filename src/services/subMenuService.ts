import { ISubMenu } from "@models/backoffice/submenus/submenu";
import subMenuRepository from "@repositories/subMenuRepository";

class SubMenuService {
    async getAllSubMenus(): Promise<ISubMenu[]> {
        const subMenus = await subMenuRepository.findAll()
        return subMenus
    }
}

export default new SubMenuService()