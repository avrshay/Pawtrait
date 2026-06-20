'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("OrderItems", [
      {
        orderId: 1,
        productId: 1,
        quantity: 1,
        petImageUrl: "...",
        aiDesignImageUrl: "...",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("OrderItems", null, {});
  },
};
