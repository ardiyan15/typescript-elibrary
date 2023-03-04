"use strict";
const bcrypt = require("bcryptjs");
let password = "12345";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const passwordHashed = await bcrypt.hash(password, 12);

    await queryInterface.bulkInsert(
      "users",
      [
        {
          username: "admin",
          password: passwordHashed,
          roles: "admin",
          email: "admin@gmail.com",
          image: "default.jpg",
          createdAt: Sequelize.literal("CURRENT_TIMESTAMP"),
          updatedAt: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete("users", {
      [Op.or]: [{ username: "admin" }],
    });
  },
};
