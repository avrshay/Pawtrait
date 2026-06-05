// Mounted at /orders in server.js.

const express = require("express");
const router = express.Router();
const ordersController= require("../controllers/ordersController")
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");

// GET /orders — admin/manager: all order 
router.get("/", auth.authorize(["admin", "manager"]), ordersController.getAllOrder);
// List orders for user :id
router.get("/:id", auth.authorizeSelf, auth.authorize(["user", "admin", "manager"]), validate.validateUserIdParam, ordersController.getOrdersOfUserById);
// Line items for one order
router.get("/:id/:orderId", auth.authorizeSelf, auth.authorize(["user", "admin", "manager"]), validate.validateOrderRouteParams, ordersController.getItemsOfOrder);
// New order (checkout) for user :id
router.post("/:id", auth.authorizeSelf, auth.authorize(["user", "admin", "manager"]), validate.validateUserIdParamMin1, ordersController.createOrder);
// Update order header — staff only
router.put("/:id/:orderId", auth.authorizeSelf, auth.authorize(["admin", "manager"]), validate.validateOrderRouteParams, ordersController.updateOrder);
// Delete order — staff only
router.delete("/:id/:orderId", auth.authorizeSelf, auth.authorize(["admin"]), validate.validateOrderRouteParams, ordersController.deleteOrder);

module.exports = router;
