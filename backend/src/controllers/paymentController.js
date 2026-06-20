// controllers/paymentController.js — mock Bit payment flow

const paymentData = require("../../models/paymentData");
const orderService = require("../services/orderService");
const aiController = require("./aiController");
const { sendSuccess, sendError } = require("../middleware/errorHandler");

//startPayment function to initiate a payment
async function startPayment(req, res) {
  const { userId, totalAmount, orderId } = req.body || {};
  if (userId == null || totalAmount == null || orderId == null) {
    return sendError(res, 400, "BAD_REQUEST", "Missing payment details", {
      fields: ["userId", "totalAmount", "orderId"],
    });
  }
  if (!Number.isFinite(Number(orderId)) || Number(orderId) < 1) {
    return sendError(res, 400, "BAD_REQUEST", "invalid orderId", { field: "orderId" });
  }

  const order = await orderService.getOrderById(orderId);
  if (!order) {
    return sendError(res, 404, "NOT_FOUND", "order not found", { orderId: Number(orderId) });
  }
  if (order.userId !== Number(userId)) {
    return sendError(res, 400, "BAD_REQUEST", "order does not belong to this user", {
      field: "orderId",
    });
  }

  const paymentId = `BIT-${Date.now()}`;
  paymentData.addPending({
    paymentId,
    userId: Number(userId),
    orderId: Number(orderId),
    amount: Number(totalAmount),
    status: "pending",
  });

  return sendSuccess(
    res,
    {
      message: "Payment initiated",
      paymentId,
      bitPaymentUrl: `https://bit.co.il/pay?id=${encodeURIComponent(paymentId)}`,
    },
    201
  );
}

//handleWebhook function to handle the webhook from the payment gateway
function handleWebhook(req, res) {
  const { paymentId, status } = req.body || {};
  if (paymentId == null || String(paymentId).trim() === "") {
    return sendError(res, 400, "BAD_REQUEST", "paymentId is required", { field: "paymentId" });
  }
  const payment = paymentData.findByPaymentId(paymentId);

  if (!payment) {
    return sendError(res, 404, "NOT_FOUND", "Payment not found", { paymentId });
  }

  if (status === "success") {
    const wasPending = payment.status !== "completed";
    payment.status = "completed";
    console.log(`Payment ${paymentId} marked completed (mock).`);
    if (wasPending && payment.orderId != null) {
      aiController.enqueueOrderAiProcessing(payment.orderId);
    }
  }

  return sendSuccess(res, { acknowledged: true });
}

module.exports = { startPayment, handleWebhook };
