// In-memory pending payments (no DB).

const pendingPayments = [];

function addPending(record) {
  pendingPayments.push(record);
  return record;
}

function findByPaymentId(paymentId) {
  if (paymentId == null || String(paymentId).trim() === "") {
    return null;
  }
  return pendingPayments.find((p) => p.paymentId === paymentId) || null;
}

module.exports = {
  pendingPayments,
  addPending,
  findByPaymentId,
};
