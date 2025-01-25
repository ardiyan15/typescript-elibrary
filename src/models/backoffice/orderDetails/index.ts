import { DataTypes, Model, Sequelize } from "sequelize";

class OrderDetails extends Model {
    public id: number
    public orderId: number
    public bookId: number
    public price: number

    static initModel(sequelize: Sequelize) {
        OrderDetails.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true
            },
            orderId: {
                allowNull: false,
                type: DataTypes.INTEGER,
                references: { model: 'order', key: 'id' }
            },
            bookId: {
                allowNull: false,
                type: DataTypes.INTEGER,
                references: { model: 'book', key: 'id' }
            },
            price: {
                allowNull: false,
                type: DataTypes.DECIMAL(10, 2),
                defaultValue: 0
            }
        }, {
            sequelize,
            modelName: 'orderDetail',
            tableName: 'orderDetails'
        })
    }
}

export default OrderDetails