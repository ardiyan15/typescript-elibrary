"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("books", "isbn", {
        type: Sequelize.STRING(13),
        allowNull: true,
      }),
      queryInterface.addColumn("books", "date_of_issue", {
        type: Sequelize.DATEONLY,
        allowNull: true,
      }),
      queryInterface.addColumn("books", "publisher", {
        type: Sequelize.STRING(100),
        allowNull: true,
      }),
      queryInterface.addColumn("books", "language", {
        type: Sequelize.STRING(80),
        allowNull: true,
      }),
      queryInterface.addColumn("books", "number_of_pages", {
        type: Sequelize.STRING(10),
        allowNull: true,
      }),
      queryInterface.addColumn("books", "heavy", {
        type: Sequelize.FLOAT,
        allowNull: true,
      }),
      queryInterface.addColumn("books", "width", {
        type: Sequelize.FLOAT,
        allowNull: true,
      }),
      queryInterface.addColumn("books", "length", {
        type: Sequelize.FLOAT,
        allowNull: true,
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
