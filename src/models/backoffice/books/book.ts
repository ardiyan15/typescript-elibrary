import { DataTypes, Model, Sequelize } from "sequelize";

export interface IBook {
  id?: number | string
  title: string
  category: string
  price: number
  image?: string
  description: string
  createdAt?: Date | string
  updatedAt?: Date | string
}

export interface IBookResponse {
  data: IBook[]
  recordsTotal: number
  recordsFiltered: number
}
class Book extends Model<IBook> implements IBook {
  public id: number
  public title: string
  public category: string
  public price: number
  public image: string
  public description: string
  static initModel(sequelize: Sequelize) {
    Book.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      title: DataTypes.STRING(60),
      category: DataTypes.STRING(60),
      price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
      },
      image: DataTypes.STRING(128),
      description: DataTypes.TEXT,
    }, {
      sequelize,
      modelName: 'book',
      tableName: 'book'
    })
  }
}

export default Book