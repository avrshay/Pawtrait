// Mounted in server.js 
// Full paths: GET /gallery, GET /gallery/:product_id, POST/PUT/DELETE /gallery (admin writes).

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const productsController = require("../controllers/productsController");
const validate = require("../middleware/validate");

// Anyone (no login headers): browse gallery for the storefront
router.get("/", productsController.getAllProducts);
router.get("/:product_id", validate.validateProductIdParam, productsController.getProductById);

// Admin only (header x-user-role: admin): manage catalog entries
router.post("/", auth.authorize(["admin"]), productsController.createProduct);
router.put("/:product_id", auth.authorize(["admin"]), validate.validateProductIdParam, productsController.updateProduct);
router.delete("/:product_id", auth.authorize(["admin"]), validate.validateProductIdParam, productsController.deleteProduct);

module.exports = router;
