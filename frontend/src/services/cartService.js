import { apiRequest } from "./api";

// All cart routes require auth headers (x-user-id / x-user-role).

// GET /cart — the current user's cart and items.
export function getCart() {
  return apiRequest("/cart", { auth: true });
}

// POST /cart — body: { productId, quantity, petImageUrl }.
export function addItem({ productId, quantity, petImageUrl }) {
  return apiRequest("/cart", {
    method: "POST",
    body: { productId, quantity, petImageUrl },
    auth: true,
  });
}

// PUT /cart/:item_id — body: { quantity }.
export function updateItemQuantity(itemId, quantity) {
  return apiRequest(`/cart/${itemId}`, { method: "PUT", body: { quantity }, auth: true });
}

// DELETE /cart/:item_id — remove a single line.
export function deleteItem(itemId) {
  return apiRequest(`/cart/${itemId}`, { method: "DELETE", auth: true });
}

// DELETE /cart/clear — empty the whole cart.
export function clearCart() {
  return apiRequest("/cart/clear", { method: "DELETE", auth: true });
}
