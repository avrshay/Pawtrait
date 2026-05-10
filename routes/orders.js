const express = require("express");
const router = express.Router();
const ordersController= require("../controllers/ordersController")
const auth = require("../middleware/auth");

router.get("/:id",auth.authorizeSelf,auth.authorize(["admin","manager"]), ordersController.getOrdersOfUserById);
router.get("/:id/:orderId",auth.authorizeSelf,auth.authorize(["admin","manager"]), ordersController.getItemsOfOrder);

module.exports = router;