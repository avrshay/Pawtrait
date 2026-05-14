// Mounted at /payments in server.js

const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.post("/start", paymentController.startPayment);
router.post("/webhook", paymentController.handleWebhook);

module.exports = router;
