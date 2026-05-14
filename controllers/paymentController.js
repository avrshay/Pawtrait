// controllers/paymentController.js — mock Bit payment flow

const paymentData = require("../models/paymentData");

// POST /payments/start
function startPayment(req, res) {
  const { userId, totalAmount } = req.body || {};
  if (userId == null || totalAmount == null) {
    return res.status(400).json({ message: "Missing payment details" });
  }

  const paymentId = `BIT-${Date.now()}`;
  paymentData.addPending({
    paymentId,
    userId: Number(userId),
    amount: Number(totalAmount),
    status: "pending",
  });

  return res.status(200).json({
    message: "Payment initiated",
    paymentId,
    bitPaymentUrl: `https://bit.co.il/pay?id=${encodeURIComponent(paymentId)}`,
  });
}

// POST /payments/webhook — no auth (provider callback)
function handleWebhook(req, res) {
  const { paymentId, status } = req.body || {};
  const payment = paymentData.findByPaymentId(paymentId);

  if (!payment) {
    return res.status(404).json({ message: "Payment not found" });
  }

  if (status === "success") {
    payment.status = "completed";
    console.log(`Payment ${paymentId} marked completed (mock).`);
  }

  return res.status(200).send("OK");
}

module.exports = { startPayment, handleWebhook };
