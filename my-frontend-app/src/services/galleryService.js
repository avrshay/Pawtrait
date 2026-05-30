import { apiRequest } from "./api";

// GET /gallery — public list of all products.
export function getAllProducts() {
  return apiRequest("/gallery");
}

// GET /gallery/:product_id — a single product.
export function getProductById(productId) {
  return apiRequest(`/gallery/${productId}`);
}

// POST /gallery — admin only.
export function createProduct(product) {
  return apiRequest("/gallery", { method: "POST", body: product, auth: true });
}

// PUT /gallery/:product_id — admin only.
export function updateProduct(productId, product) {
  return apiRequest(`/gallery/${productId}`, { method: "PUT", body: product, auth: true });
}

// DELETE /gallery/:product_id — admin only.
export function deleteProduct(productId) {
  return apiRequest(`/gallery/${productId}`, { method: "DELETE", auth: true });
}
