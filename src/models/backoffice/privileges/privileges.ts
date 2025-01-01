import { DataTypes, Model, Sequelize } from "sequelize";

interface IPrivilege {
    userId: number
    submenuId: number
}

class Privilege extends Model implements IPrivilege {

    public userId!: number;
    public submenuId!: number;

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