const express = require("express");
const router = express.Router();
const logger = require("../middleware/logger");
const auth = require("../middleware/auth");

router.use(logger);//log the request and response

const productsController= require("../controllers/productsController")

router.get("/", productsController.getAllProducts);
router.get("/:product_id", productsController.getProductById);

//admin only functions:
router.post("/", auth.authorize(["admin"]), productsController.createProduct);
router.put("/:product_id", auth.authorize(["admin"]), productsController.updateProduct);
router.delete("/:product_id", auth.authorize(["admin"]), productsController.deleteProduct);

module.exports = router;