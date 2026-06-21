'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("CartItems", [
      {
        cartId: 1,
        productId: 2,
        quantity: 1,
        petImageUrl: "http://localhost:3000/images/clients/dog2-original.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        cartId: 1,
        productId: 3,
        quantity: 2,
        petImageUrl: "http://localhost:3000/images/clients/dog2-original.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        cartId: 2,
        productId: 1,
        quantity: 1,
        petImageUrl: "http://localhost:3000/images/clients/dog2-original.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  async down(queryInterface, Sequelize) {
    if (await queryInterface.tableExists("CartItems")) {
      await queryInterface.bulkDelete("CartItems", null, {});
    }
  },
};
