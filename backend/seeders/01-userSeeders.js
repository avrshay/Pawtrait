'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        firstName: "Dan",
        lastName: "Cohen",
        userRole: "admin",
        email: "dan1@gmail.com",
        phone_number: "0558256478",
        password: "Dan123",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: "Shani",
        lastName: "Levi",
        userRole: "manager",
        email: "shani2@gmail.com",
        phone_number: "0558276478",
        password: "Shani123",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: "Gal",
        lastName: "Levi",
        userRole: "user",
        email: "gal3@gmail.com",
        phone_number: "0558272478",
        password: "gal123",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
