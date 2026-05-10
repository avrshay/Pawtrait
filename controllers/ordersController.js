const orders = require("../models/ordersMockData");

function getOrdersOfUserById(req, res) {
  const id= req.params.id;
  const allOrders = orders.getAllOrdersById(id);
  res.status(200).json(allOrders);
}

function getItemsOfOrder(req, res) {
  const userId= req.params.id;
  const orderId = req.params.orderId;
  const allOrders = orders.getAllItemsOrdersById(userId,orderId);
  res.status(200).json(allOrders);
}

module.exports = { getOrdersOfUserById,getItemsOfOrder };