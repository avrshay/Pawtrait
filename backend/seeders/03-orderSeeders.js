'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Orders", [
      {
        userId: 2,
        status: "processing",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 3,
        status: "completed",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 3,
        status: "processing",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  async down(queryInterface, Sequelize) {
    if (await queryInterface.tableExists("Orders")) {
      await queryInterface.bulkDelete("Orders", null, {});
    }
  },
};
