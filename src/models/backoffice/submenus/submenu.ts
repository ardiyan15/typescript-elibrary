import { DataTypes, Model, Sequelize } from "sequelize";

export interface ISubMenu {
    id: number
    name: string
    code: string
    url: string
    menuId: number
}

class Submenu extends Model implements ISubMenu {
    public id: number;
    public name: string
    public code: string
    public url: string
    public menuId: number

    static initModel(sequelize: Sequelize) {
        Submenu.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true
            },
            name: DataTypes.STRING(60),
            code: DataTypes.STRING(60),
            url: DataTypes.STRING(128),
            menuId: {
                type: DataTypes.INTEGER,
                references: { model: 'menu', key: 'id' },
                allowNull: false
            }
        }, {
            sequelize,
            modelName: "submenu",
            tableName: "submenu"
        })
    }
}


export default Submenu