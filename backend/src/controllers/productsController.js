const productService = require("../services/productService");
const { sendSuccess, sendError } = require("../middleware/errorHandler");

// GET /gallery — returns every product in the catalog.
async function getAllProducts(req, res) {
  const allProducts = await productService.getAllProducts();
  return sendSuccess(res, allProducts.length === 0 ? [] : allProducts);
}

// GET /gallery/:product_id — returns one product by its id.
async function getProductById(req, res) {
  const product_id = req.params.product_id;
  const product = await productService.getProductById(product_id);
  if (!product) {
    return sendError(res, 404, "NOT_FOUND", "product not found", { product_id });
  }
  return sendSuccess(res, product);
}

// POST /gallery — creates a new product, admin/manager only.
async function createProduct(req, res) {
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
  const newProduct = await productService.createProduct(product);
  if (!newProduct) {
    return sendError(res, 500, "INTERNAL_SERVER_ERROR", "failed to create product", {});
  }
  return sendSuccess(res, newProduct, 201);
}

// PUT /gallery/:product_id — updates an existing product, admin/manager only.
async function updateProduct(req, res) {
  const product_id = req.params.product_id;
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
  const updatedProduct = await productService.updateProduct(product_id, product);
  if (!updatedProduct) {
    return sendError(res, 404, "NOT_FOUND", "product not found", { product_id });
  }
  return sendSuccess(res, await productService.getProductById(product_id));
}

// DELETE /gallery/:product_id — removes a product, admin only.
async function deleteProduct(req, res) {
  const product_id = req.params.product_id;
  const deletedProduct = await productService.deleteProduct(product_id);
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
