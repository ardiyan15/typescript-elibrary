import { DataTypes, Model, Sequelize } from "sequelize";

class Order extends Model {
    public id: number
    public itemId: number
    public quantity: number

    static initModel(sequelize: Sequelize) {
        Order.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            totalPrice: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0
            },
            paymentStatus: {
                type: DataTypes.STRING(30),
                allowNull: false,
                defaultValue: 'unpaid'
            }
        }, {
            sequelize,
            modelName: 'order',
            tableName: 'orders'
        })
    }
}

export default Order