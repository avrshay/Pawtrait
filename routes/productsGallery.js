// Mounted in server.js as app.use("/gallery", ...).
// Full paths: GET /gallery, GET /gallery/:product_id, POST/PUT/DELETE /gallery (admin writes).

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const productsController = require("../controllers/productsController");

// Anyone (no login headers): browse gallery for the storefront
router.get("/", productsController.getAllProducts);
router.get("/:product_id", productsController.getProductById);

// Admin only (header x-user-role: admin): manage catalog entries
router.post("/", auth.authorize(["admin"]), productsController.createProduct);
router.put("/:product_id", auth.authorize(["admin"]), productsController.updateProduct);
router.delete("/:product_id", auth.authorize(["admin"]), productsController.deleteProduct);

module.exports = router;
