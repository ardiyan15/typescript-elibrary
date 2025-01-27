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
            fullname: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            address: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            transactionId: {
                type: DataTypes.STRING(128),
                allowNull: false,
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