'use strict';
require("dotenv").config();
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Products", [
      {
        name: "Designed Cup",
        original_pet_image_url: `${BACKEND_URL}/images/clients/dog1-original.jpg`,
        custom_product_image_url: `${BACKEND_URL}/images/catalog/products/cup-design-dog1.png`,
        price: 50,
      },
      {
        name: "Tote Bag",
        original_pet_image_url: `${BACKEND_URL}/images/clients/dog2-original.jpg`,
        custom_product_image_url: `${BACKEND_URL}/images/catalog/products/bag-design-dog2.png`,
        price: 35,
      },
      {
        name: "Soft Pillow",
        original_pet_image_url: `${BACKEND_URL}/images/clients/dog3-original.jpg`,
        custom_product_image_url: `${BACKEND_URL}/images/catalog/products/pillow-design-dog3.png`,
        price: 65,
      },
      {
        name: "Baseball Cap",
        original_pet_image_url: `${BACKEND_URL}/images/clients/dog4-original.jpg`,
        custom_product_image_url: `${BACKEND_URL}/images/catalog/products/cap-design-dog4.png`,
        price: 55,
      },
    ]);
  },
  async down(queryInterface, Sequelize) {
    if (await queryInterface.tableExists("Products")) {
      await queryInterface.bulkDelete("Products", null, {});
    }
  },
};
