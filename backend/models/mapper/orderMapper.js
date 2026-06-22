
// Converts an Order DB object into a simpler object for the frontend:
// renames "id" to "orderId" and "createdAt" to "createDate", and drops "updatedAt".
function toOrderDTO(order) {
  if (!order) return order;
  const { id, createdAt, updatedAt, ...rest } = order.toJSON();
  return { orderId: id, createDate: createdAt, ...rest };
}

module.exports = { toOrderDTO };