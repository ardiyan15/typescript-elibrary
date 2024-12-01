import { DataTypes, Model } from "sequelize";

import sequelize from "../../../utils/connection";

export interface IUser {
  id?: number | string;
  username: string;
  password: string
  roles: string;
  email: string;
  image: string;
  createdAt?: Date | string
  updatedAt?: Date | string
}

class User extends Model<IUser> implements IUser {
  public id!: number;
  public username!: string;
  public password!: string;
  public roles!: string;
  public email!: string;
  public image!: string
}

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

export default User;
