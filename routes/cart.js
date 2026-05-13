const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const auth = require("../middleware/auth");

// Literal path before /:item_id so "clear" is not parsed as an item id.
router.delete(
  "/clear",
  auth.authorize(["user", "admin", "manager"]),
  auth.requireCartUserIdHeader,
  cartController.clearCart
);

router.get(
  "/",
  auth.authorize(["user", "admin", "manager"]),
  auth.requireCartUserIdHeader,
  cartController.getCart
);

router.post(
  "/",
  auth.authorize(["user", "admin", "manager"]),
  auth.requireCartUserIdHeader,
  cartController.addItem
);

router.patch(
  "/:item_id",
  auth.authorize(["user", "admin", "manager"]),
  cartController.updateItemQuantity
);

router.put(
  "/:item_id",
  auth.authorize(["user", "admin", "manager"]),
  cartController.updateItemQuantity
);

router.delete(
  "/:item_id",
  auth.authorize(["user", "admin", "manager"]),
  cartController.deleteItem
);

module.exports = router;
