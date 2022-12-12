"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  users.init(
    {
      username: Sequelize.STRING(60),
      password: Sequelize.STRING(128),
      roles: Sequelize.STRING(30),
      email: Sequelize.STRING(30),
      image: Sequelize.STRING(128),
    },
    {
      sequelize,
      modelName: "users",
    }
  );
  return users;
};
