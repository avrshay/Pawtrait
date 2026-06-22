'use strict';
const {
  Model
} = require('sequelize');
// CartItem model: one product line inside a cart (with quantity and the pet image used for it).
module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {

    // Defines how CartItem relates to other tables.
    static associate(models) {
      CartItem.belongsTo(models.Cart, {foreignKey: "cartId"}); // each item belongs to one cart
      CartItem.belongsTo(models.Product, {foreignKey: "productId"});    } // each item refers to one product
  }
  CartItem.init({
    cartId: { // id of the cart this item is in
      type: DataTypes.INTEGER,
      allowNull: false
    },
    productId: { // id of the product being bought
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: { // how many of this product
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    petImageUrl: { // link to the pet photo used for this item
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'CartItem',
  });
  return CartItem;
};