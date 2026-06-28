'use strict';
require("dotenv").config();
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("CartItems", [
      {
        cartId: 1,
        productId: 2,
        quantity: 1,
        petImageUrl: `${BACKEND_URL}/images/clients/dog2-original.jpg`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        cartId: 1,
        productId: 3,
        quantity: 2,
        petImageUrl: `${BACKEND_URL}/images/clients/dog2-original.jpg`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        cartId: 2,
        productId: 1,
        quantity: 1,
        petImageUrl: `${BACKEND_URL}/images/clients/dog2-original.jpg`,
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
