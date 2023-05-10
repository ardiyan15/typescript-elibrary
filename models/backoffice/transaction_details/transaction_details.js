const Sequelize = require("sequelize");

const sequelize = require("../../../util/database");

const Transaction_detail = sequelize.define("transaction_details", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  transaction_id: {
    type: Sequelize.INTEGER,
  },
  book_id: {
    type: Sequelize.INTEGER,
  },
  createdAt: {
    type: Sequelize.DATE,
  },
  updatedAt: {
    type: Sequelize.DATE,
  },
});

module.exports = Transaction_detail;
