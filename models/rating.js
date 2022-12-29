"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Rating.belongsTo(models.users, {
        foreignKey: "userId",
      });

      Rating.belongsTo(models.books, {
        foreignKey: "bookId",
      });
    }
  }
  Rating.init(
    {
      rate: DataTypes.STRING,
      review: DataTypes.TEXT,
      userId: DataTypes.INTEGER,
      bookId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Rating",
    }
  );
  return Rating;
};
