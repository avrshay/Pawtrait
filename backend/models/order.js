'use strict';
const {
  Model
} = require('sequelize');
// Order model: represents one purchase made by a user.
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {

    // Defines how Order relates to other tables.
    static associate(models) {
      Order.belongsTo(models.User, {foreignKey: "userId"}); // each order belongs to one user
      Order.hasMany(models.OrderItem, {foreignKey: "orderId"}); // an order can have many items
    }
  }
  Order.init({
    userId: { // id of the user who placed the order
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: { // current state of the order
      type: DataTypes.ENUM(
        "processing",
        "completed"
       ),
      allowNull: false,
      defaultValue: "processing"
    }
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};
