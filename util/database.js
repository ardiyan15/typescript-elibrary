const Sequelize = require("sequelize");

const sequelize = new Sequelize("e_library", "root", "", {
  dialect: "mysql",
  host: "localhost",
  logging: false,
  dialectOptions: {
    useUTC: false,
  },
  timezone: "+07:00",
});

module.exports = sequelize;
