import { DataTypes, Model, Sequelize } from "sequelize";

export interface IBook {
  id?: number | string
  title: string
  category: string
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
      image: DataTypes.STRING(128),
      description: DataTypes.TEXT,
    }, {
      sequelize,
      modelName: 'book'
    })
  }
}

export default Book