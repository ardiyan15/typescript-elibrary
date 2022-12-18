const Sequelize = require("sequelize");

const sequelize = require("../../../util/database");

const Book = sequelize.define("book", {
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
});

module.exports = Book;
