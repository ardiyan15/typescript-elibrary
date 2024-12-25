import { DataTypes, Model, Sequelize } from "sequelize";

export interface IMenu {
    id: number
    name: string
    order: number
}

class Menu extends Model implements IMenu {
    public id: number;
    public name: string
    public order: number 
    
    static initModel(sequelize: Sequelize) {
        Menu.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true
            },
            name: DataTypes.STRING(60),
            order: DataTypes.INTEGER,
            icon: DataTypes.STRING(60),
        }, {
            sequelize,
            modelName: "menu",
            tableName: "menu"
        })
    }
}

export default Menu