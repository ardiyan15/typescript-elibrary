"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Book.hasMany(models.Rating, {
        foreignKey: "bookId",
      });
    }
  }
  Book.init(
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      title: Sequelize.STRING(60),
      author: Sequelize.STRING(100),
      category: Sequelize.STRING(50),
      description: Sequelize.TEXT,
      image: Sequelize.STRING(128),
      isbn: Sequelize.STRING(13),
      publication_date: Sequelize.DATEONLY,
      publisher: Sequelize.STRING(100),
      language: Sequelize.STRING(80),
      number_of_pages: Sequelize.STRING(10),
      heavy: Sequelize.FLOAT,
      width: Sequelize.FLOAT,
      length: Sequelize.FLOAT,
      isBorrow: Sequelize.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Book",
    }
  );
  return Book;
};
