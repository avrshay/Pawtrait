'use strict';
const {
  Model
} = require('sequelize');
// OrderItem model: one product line inside an order (with quantity and images used for it).
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {

    // Defines how OrderItem relates to other tables.
    static associate(models) {
      OrderItem.belongsTo(models.Order, {foreignKey: "orderId"}); // each item belongs to one order
      OrderItem.belongsTo(models.Product, {foreignKey: "productId"}); // each item refers to one product
    }
  }
  OrderItem.init({
    orderId: { // id of the order this item is in
      type: DataTypes.INTEGER,
      allowNull: false
    },
    productId: { // id of the product that was ordered
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: { // how many of this product, must be at least 1
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {min: 1}
    },
    petImageUrl: { // link to the original pet photo used
      type: DataTypes.STRING,
      allowNull: false
    },
    aiDesignImageUrl: DataTypes.STRING // link to the AI-generated design image (optional)
  }, {
    sequelize,
    modelName: 'OrderItem',
  });
  return OrderItem;
};