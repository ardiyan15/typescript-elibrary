const Sequelize = require("sequelize");

const sequelize = require("../../../util/database");

const Transaction = sequelize.define("transaction", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  transaction_number: {
    type: Sequelize.STRING,
  },
  address_delivery: {
    type: Sequelize.TEXT,
  },
  status: {
    type: Sequelize.BOOLEAN,
  },
});

module.exports = Transaction;
