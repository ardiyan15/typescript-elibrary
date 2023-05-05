const Sequelize = require("sequelize");

const sequelize = require("../../../util/database");

const Banner = sequelize.define("banner", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: Sequelize.STRING(60),
  image: Sequelize.STRING(128),
  type: Sequelize.STRING(30),
});

module.exports = Banner;
