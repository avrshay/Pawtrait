import { apiRequest } from "./api";

// POST /payments/start — begin a payment for an order.
export function startPayment(payload) {
  return apiRequest("/payments/start", { method: "POST", body: payload });
}

// Note: POST /payments/webhook is called server-to-server by the payment
// provider, not from the frontend, so it is intentionally not exposed here.
