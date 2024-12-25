import sequelize from "@utils/connection";
import User from '@models/backoffice/users/user'
import Menu from "@models/backoffice/menus/menu";
import Submenu from "@models/backoffice/submenus/submenu";

import relation from "./relation";
import Privilege from "./backoffice/privileges/privileges";

const models = {
    Menu: Menu.initModel(sequelize),
    Submenu: Submenu.initModel(sequelize),
    User: User.initModel(sequelize),
    Privilege: Privilege.initModel(sequelize)
}

relation()

export { sequelize, models }