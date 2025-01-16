import sequelize from "@utils/connection";
import User from '@models/backoffice/users/user'
import Menu from "@models/backoffice/menus/menu";
import Submenu from "@models/backoffice/submenus/submenu";

import relation from "./relation";
import Privilege from "./backoffice/privileges/privileges";
import Book from "./backoffice/books/book";

const models = {
    Menu: Menu.initModel(sequelize),
    Submenu: Submenu.initModel(sequelize),
    User: User.initModel(sequelize),
    Privilege: Privilege.initModel(sequelize),
    Book: Book.initModel(sequelize)
}

relation()

export { sequelize, models }