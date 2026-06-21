'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Carts", [
      {
        userId: 2,
        createdAt: new Date("2026-01-10T10:00:00.000Z"),
        updatedAt: new Date(),
      },
      {
        userId: 3,
        createdAt: new Date("2026-01-11T14:30:00.000Z"),
        updatedAt: new Date(),
      },
    ]);
  },
  async down(queryInterface, Sequelize) {
    if (await queryInterface.tableExists("Carts")) {
      await queryInterface.bulkDelete("Carts", null, {});
    }
  },
};
