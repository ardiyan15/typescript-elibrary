import { Model, Sequelize, DataTypes } from "sequelize";

class Customer extends Model {
    static initModel(sequelize: Sequelize) {
        Customer.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            email: DataTypes.STRING(60),
            password: DataTypes.STRING(128),
        }, {
            sequelize,
            modelName: "customer",
        })
    }
}

export default Customer;