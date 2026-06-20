import { apiRequest } from "./api";

// POST /payments/start — begin a payment for an order.
export function startPayment(payload) {
  return apiRequest("/payments/start", { method: "POST", body: payload, auth: true });
}

// POST /payments/webhook — mock: mark payment success
export function confirmPaymentWebhook({ paymentId, status = "success" }) {
  return apiRequest("/payments/webhook", {
    method: "POST",
    body: { paymentId, status },
  });
};
