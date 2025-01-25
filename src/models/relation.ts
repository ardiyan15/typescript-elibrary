import User from "@models/backoffice/users/user";
import Menu from "@models/backoffice/menus/menu";
import Submenu from "@models/backoffice/submenus/submenu";
import Privilege from "./backoffice/privileges/privileges";
import Order from "@models/backoffice/orders";
import Book from "@models/backoffice/books/book";
import OrderDetails from "@models/backoffice/orderDetails";

export default function relation() {
    Menu.hasMany(Submenu, {foreignKey: 'menuId', as: 'submenus'})
    Submenu.belongsTo(Menu, {foreignKey: 'menuId', as: 'menu'})

    User.belongsToMany(Submenu, {through: Privilege, as: 'submenu', foreignKey: 'userId'})
    Submenu.belongsToMany(User, {through: Privilege, as: 'user', foreignKey: 'submenuId'})

    Order.belongsToMany(Book, {through: OrderDetails,  as: 'books', foreignKey: 'orderId'})
    Book.belongsToMany(Order, {through: OrderDetails, as: 'orders', foreignKey: 'bookId'})
}