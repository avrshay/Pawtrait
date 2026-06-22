'use strict';
const {
  Model
} = require('sequelize');
// Product model: represents one custom product (e.g. a pet-themed item) that can be sold.
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {

    static associate(models) {
      Product.hasMany(models.OrderItem, {foreignKey: "productId"}); // a product can appear in many order items
      Product.hasMany(models.CartItem, {foreignKey: "productId"}); // a product can appear in many cart items
    }
  }
  Product.init({
    name: { // product name
      type: DataTypes.STRING,
      allowNull: false
    },
    original_pet_image_url: { // link to the original uploaded pet photo
      type: DataTypes.STRING,
      allowNull: false
    },
    custom_product_image_url: { // link to the final customized product image
      type: DataTypes.STRING,
      allowNull: false
    },
    price: { // product price
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Product',
    timestamps: false
  });
  return Product;
};