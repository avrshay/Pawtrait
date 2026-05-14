// Mounted at /orders in server.js.

const express = require("express");
const router = express.Router();
const ordersController= require("../controllers/ordersController")
const auth = require("../middleware/auth");

// GET /orders — admin/manager: all order 
router.get("/", auth.authorize(["admin", "manager"]), ordersController.getAllOrder);
// List orders for user :id
router.get("/:id", auth.authorizeSelf, auth.authorize(["user", "admin", "manager"]), ordersController.getOrdersOfUserById);
// Line items for one order
router.get("/:id/:orderId", auth.authorizeSelf, auth.authorize(["user", "admin", "manager"]), ordersController.getItemsOfOrder);
// New order (checkout) for user :id
router.post("/:id", auth.authorizeSelf, auth.authorize(["user", "admin", "manager"]), ordersController.createOrder);
// Update order header — staff only
router.put("/:id/:orderId", auth.authorizeSelf, auth.authorize(["admin", "manager"]), ordersController.updateOrder);
// Delete order — staff only
router.delete("/:id/:orderId", auth.authorizeSelf, auth.authorize(["admin", "manager"]), ordersController.deleteOrder);

module.exports = router;
