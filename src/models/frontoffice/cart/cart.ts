import { Model, Sequelize, DataTypes } from "sequelize";

class Cart extends Model {
    static initModel(sequelize: Sequelize) {
        Cart.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            price: {
                allowNull: false,
                type: DataTypes.DECIMAL(10, 2),
                defaultValue: 0
            },
            qty: {
                allowNull: false,
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            userId: {
                allowNull: false,
                type: DataTypes.INTEGER,
                references: { model: 'users', key: 'id' }
            },
            bookId: {
                allowNull: false,
                type: DataTypes.INTEGER,
                references: { model: 'books', key: 'id' }
            },
        }, {
            sequelize,
            modelName: "cart",
        })
    }
}

export default Cart;