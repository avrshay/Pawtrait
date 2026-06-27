'use strict';
require("dotenv").config();
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("OrderItems", [
      {
        orderId: 1,
        productId: 1,
        quantity: 1,
        petImageUrl: `${BACKEND_URL}/images/clients/dog1-original.jpg`,
        aiDesignImageUrl: `${BACKEND_URL}/images/catalog/products/pillow-design-dog3.png`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 2,
        productId: 2,
        quantity: 1,
        petImageUrl: `${BACKEND_URL}/images/clients/dog2-original.jpg`,
        aiDesignImageUrl: `${BACKEND_URL}/images/catalog/products/bag-design-dog2.png`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 3,
        productId: 3,
        quantity: 2,
        petImageUrl: `${BACKEND_URL}/images/clients/dog3-original.jpg`,
        aiDesignImageUrl: `${BACKEND_URL}/images/catalog/products/pillow-design-dog3.png`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  async down(queryInterface, Sequelize) {
    if (await queryInterface.tableExists("OrderItems")) {
      await queryInterface.bulkDelete("OrderItems", null, {});
    }
  },
};
