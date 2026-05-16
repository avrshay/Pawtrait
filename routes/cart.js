const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");

// Delete the cart for the given user id.
router.delete(
  "/clear",
  auth.authorize(["user", "admin", "manager"]),
  auth.requireCartUserIdHeader,
  cartController.clearCart
);

// Get the cart and all items in the cart for the given user id.
router.get(
  "/",
  auth.authorize(["user", "admin", "manager"]),
  auth.requireCartUserIdHeader,
  cartController.getCart
);

// Add a new item to the cart for the given user id.
router.post(
  "/",
  auth.authorize(["user", "admin", "manager"]),
  auth.requireCartUserIdHeader,
  validate.validateCartAddItem,
  cartController.addItem
);

// Update the quantity of a cart item for the given item id.
router.put(
  "/:item_id",
  auth.authorize(["user", "admin", "manager"]),
  auth.requireCartUserIdHeader,
  validate.validateCartItemIdParam,
  validate.validateCartUpdateQuantity,
  cartController.updateItemQuantity
);

// Delete a cart item for the given item id.
router.delete(
  "/:item_id",
  auth.authorize(["user", "admin", "manager"]),
  auth.requireCartUserIdHeader,
  validate.validateCartItemIdParam,
  cartController.deleteItem
);

module.exports = router;
