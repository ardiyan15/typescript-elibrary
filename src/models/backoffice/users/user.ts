import { DataTypes, Model, Sequelize } from "sequelize";

export interface IUser {
  id?: number | string;
  username: string;
  password?: string
  roles: string;
  email: string;
  image?: string;
  createdAt?: Date | string
  updatedAt?: Date | string
  submenu?: {
    id: number
  }[]
  privileges?: []
}

export interface IUserResponse {
  data: IUser[]
  recordsTotal: number
  recordsFiltered: number
}

class User extends Model<IUser> implements IUser {
  public id!: number;
  public username!: string;
  public password!: string;
  public roles!: string;
  public email!: string;
  public image!: string

  static initModel(sequelize: Sequelize) {
    User.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      username: DataTypes.STRING(60),
      password: DataTypes.STRING(128),
      roles: DataTypes.STRING(30),
      email: DataTypes.STRING(30),
      image: DataTypes.STRING(128),
    }, {
      sequelize,
      modelName: "user",
    });
  }
}


export default User;
