// In-memory pending payments (no DB).
// This array just lives in memory, not in the database. Data is lost on server restart.

const pendingPayments = [];

// Adds a new pending payment record to the list and returns it.
function addPending(record) {
  pendingPayments.push(record);
  return record;
}

// Finds a pending payment by its paymentId. Returns null if not found or if no id was given.
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
