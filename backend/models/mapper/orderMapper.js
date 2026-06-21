// The frontend expects "orderId" (primary key) and "createDate" (created timestamp) —
// names from when this project still used mock data — but the Sequelize columns
// are "id" and "createdAt". Translate at the boundary.
function toOrderDTO(order) {
  if (!order) return order;
  const { id, createdAt, updatedAt, ...rest } = order.toJSON();
  return { orderId: id, createDate: createdAt, ...rest };
}

module.exports = { toOrderDTO };