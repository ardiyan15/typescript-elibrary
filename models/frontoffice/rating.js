const Sequelize = require("sequelize");

const sequelize = require("../../util/database");

const Rating = sequelize.define("rating", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  rate: Sequelize.STRING,
  review: Sequelize.TEXT,
  userId: Sequelize.INTEGER,
  bookId: Sequelize.INTEGER,
});

module.exports = Rating;
