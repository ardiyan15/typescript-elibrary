import User from "@models/backoffice/users/user";
import Menu from "@models/backoffice/menus/menu";
import Submenu from "@models/backoffice/submenus/submenu";
import Privilege from "./backoffice/privileges/privileges";
import Order from "@models/backoffice/orders";
import Book from "@models/backoffice/books/book";
import OrderDetails from "@models/backoffice/orderDetails";
import Cart from "./frontoffice/cart/cart";

export default function relation() {
    Menu.hasMany(Submenu, {foreignKey: 'menuId', as: 'submenus'})
    Submenu.belongsTo(Menu, {foreignKey: 'menuId', as: 'menu'})

    User.belongsToMany(Submenu, {through: Privilege, as: 'submenu', foreignKey: 'userId'})
    Submenu.belongsToMany(User, {through: Privilege, as: 'user', foreignKey: 'submenuId'})

    Order.belongsToMany(Book, {through: OrderDetails,  as: 'books', foreignKey: 'orderId'})
    Book.belongsToMany(Order, {through: OrderDetails, as: 'orders', foreignKey: 'bookId'})

    User.hasMany(Cart, {foreignKey: 'userId', as: 'carts'})
    Cart.belongsTo(User, {foreignKey: 'userId', as: 'user'})

    Book.hasMany(Cart, {foreignKey: 'bookId', as: 'carts'})
    Cart.belongsTo(Book, {foreignKey: 'bookId', as: 'book'})
}