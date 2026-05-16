const products = require("../models/productsMockData");
const { sendSuccess, sendError } = require("../middleware/errorHandler");

function getAllProducts(req, res) {
  const allProducts = products.getAllProducts();
  return sendSuccess(res, allProducts.length === 0 ? [] : allProducts);
}

function getProductById(req, res) {
  const product_id = req.params.product_id;
  if (!product_id || !Number.isFinite(Number(product_id))) {
    return sendError(res, 400, "BAD_REQUEST", "invalid product_id", { field: "product_id" });
  }
  const product = products.getProductById(product_id);
  if (!product) {
    return sendError(res, 404, "NOT_FOUND", "product not found", { product_id });
  }
  return sendSuccess(res, product);
}

function createProduct(req, res) {
  const product = req.body;
  if (
    !product.name ||
    !product.original_pet_image_url ||
    !product.custom_product_image_url ||
    product.price === undefined ||
    product.price === null
  ) {
    return sendError(res, 400, "BAD_REQUEST", "invalid product data", {
      fields: ["name", "original_pet_image_url", "custom_product_image_url", "price"],
    });
  }
  const newProduct = products.createProduct(product);
  if (!newProduct) {
    return sendError(res, 500, "INTERNAL_SERVER_ERROR", "failed to create product", {});
  }
  return sendSuccess(res, newProduct, 201);
}

function updateProduct(req, res) {
  const product_id = req.params.product_id;
  if (!product_id || !Number.isFinite(Number(product_id))) {
    return sendError(res, 400, "BAD_REQUEST", "invalid product_id", { field: "product_id" });
  }
  const product = req.body;
  if (
    !product.name ||
    !product.original_pet_image_url ||
    !product.custom_product_image_url ||
    product.price === undefined ||
    product.price === null
  ) {
    return sendError(res, 400, "BAD_REQUEST", "invalid product data", {
      fields: ["name", "original_pet_image_url", "custom_product_image_url", "price"],
    });
  }
  const updatedProduct = products.updateProduct(product_id, product);
  if (!updatedProduct) {
    return sendError(res, 404, "NOT_FOUND", "product not found", { product_id });
  }
  return sendSuccess(res, products.getProductById(product_id));
}

function deleteProduct(req, res) {
  const product_id = req.params.product_id;
  if (!product_id || !Number.isFinite(Number(product_id))) {
    return sendError(res, 400, "BAD_REQUEST", "invalid product_id", { field: "product_id" });
  }
  const deletedProduct = products.deleteProduct(product_id);
  if (!deletedProduct) {
    return sendError(res, 404, "NOT_FOUND", "product not found", { product_id });
  }
  return sendSuccess(res, { product_id: Number(product_id) });
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
