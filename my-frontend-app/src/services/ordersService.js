import { apiRequest } from "./api";

// GET /orders — admin/manager: every order.
export function getAllOrders() {
  return apiRequest("/orders", { auth: true });
}

// GET /orders/:id — orders belonging to user :id.
export function getOrdersOfUser(userId) {
  return apiRequest(`/orders/${userId}`, { auth: true });
}

export function getOrderById(orderId) {
  return apiRequest(`/orders/${orderId}`, { auth: true });
}
// GET /orders/:id/:orderId — line items of one order.
export function getOrderItems(userId, orderId) {
  return apiRequest(`/orders/${userId}/${orderId}`, { auth: true });
}

// POST /orders/:id — place a new order (checkout) for user :id.
export function createOrder(userId, order) {
  return apiRequest(`/orders/${userId}`, { method: "POST", body: order, auth: true });
}

// PUT /orders/:id/:orderId — update an order header (staff only).
export function updateOrder(userId, orderId, order) {
  return apiRequest(`/orders/${userId}/${orderId}`, { method: "PUT", body: order, auth: true });
}

// DELETE /orders/:id/:orderId — delete an order (staff only).
export function deleteOrder(userId, orderId) {
  return apiRequest(`/orders/${userId}/${orderId}`, { method: "DELETE", auth: true });
}
