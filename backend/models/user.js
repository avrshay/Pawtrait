'use strict';
const {
Model
} = require('sequelize');
// User model: represents one registered user (customer or admin).
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    // Defines how User relates to other tables.
    static associate(models) {
      User.hasMany(models.Order, {foreignKey: "userId"}); // a user can have many orders
      User.hasOne(models.Cart, {foreignKey: "userId"}); // a user has exactly one cart
    }

  }
  User.init({
    firstName: { // user's first name
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: { // user's last name
      type: DataTypes.STRING,
      allowNull: false
    },
    userRole: { // role of the user, e.g. "customer" or "admin"
      type: DataTypes.STRING,
      allowNull: false
    },
    email: { // user's email, must be unique
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    phone_number: { // user's phone number
      type: DataTypes.STRING,
      allowNull: false
    },
    password: { // user's hashed password
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true,
  });
  return User;
};
