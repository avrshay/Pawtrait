// controllers/paymentController.js — mock Bit payment flow

const paymentData = require("../models/paymentData");
const { sendSuccess, sendError } = require("../middleware/apiResponse");

function startPayment(req, res) {
  const { userId, totalAmount } = req.body || {};
  if (userId == null || totalAmount == null) {
    return sendError(res, 400, "BAD_REQUEST", "Missing payment details", {
      fields: ["userId", "totalAmount"],
    });
  }

  const paymentId = `BIT-${Date.now()}`;
  paymentData.addPending({
    paymentId,
    userId: Number(userId),
    amount: Number(totalAmount),
    status: "pending",
  });

  return sendSuccess(res, {
    message: "Payment initiated",
    paymentId,
    bitPaymentUrl: `https://bit.co.il/pay?id=${encodeURIComponent(paymentId)}`,
  });
}

function handleWebhook(req, res) {
  const { paymentId, status } = req.body || {};
  const payment = paymentData.findByPaymentId(paymentId);

  if (!payment) {
    return sendError(res, 404, "NOT_FOUND", "Payment not found", { paymentId });
  }

  if (status === "success") {
    payment.status = "completed";
    console.log(`Payment ${paymentId} marked completed (mock).`);
  }

  return sendSuccess(res, { acknowledged: true });
}

module.exports = { startPayment, handleWebhook };
