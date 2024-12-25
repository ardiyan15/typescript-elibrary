import { DataTypes, Model, Sequelize } from "sequelize";

class Privilege extends Model {
    static initModel(sequelize: Sequelize) {
        Privilege.init(
            {
                userId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {model: 'user', key: 'id'}
                },
                submenuId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {model: 'submenu', key: 'id'}
                }
            },
            {
                sequelize,
                modelName: 'privilege',
                tableName: 'privilege',
                timestamps: true
            }
        )
    }
}

export default Privilege