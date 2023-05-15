const Sequelize = require("sequelize");

const sequelize = require("../../../util/database");

const Category = sequelize.define("category", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  code: Sequelize.STRING(20),
  description: Sequelize.STRING(10),
});

module.exports = Category;
