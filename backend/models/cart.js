'use strict';
const {
  Model
} = require('sequelize');
// Cart model: represents one shopping cart, owned by one user.
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {

    // Defines how Cart relates to other tables.
    static associate(models) {
        Cart.belongsTo(models.User, {foreignKey: "userId"}); // each cart belongs to one user
        Cart.hasMany(models.CartItem, {foreignKey: "cartId"}); // a cart can have many items
    }
  }
  Cart.init({
      userId: { // id of the user who owns this cart
        type: DataTypes.INTEGER,
        allowNull: false
      }
  }, {
    sequelize,
    modelName: 'Cart',
  });
  return Cart;
};