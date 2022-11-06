const Sequelize = require("sequelize");

const sequelize = require("../../../util/database");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  username: Sequelize.STRING(60),
  password: Sequelize.STRING(128),
  roles: Sequelize.STRING(30),
  email: Sequelize.STRING(30),
  image: Sequelize.STRING(128),
});

module.exports = User;
