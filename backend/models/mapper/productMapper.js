// The frontend expects the primary key as "product_id" (set when this project still used
// mock data), but the Sequelize model's column is "id" — translate at the boundary.
function toProductDTO(product) {
  if (!product) return product;
  const { id, ...rest } = product.toJSON();
  return { product_id: id, ...rest };
}

module.exports = { toProductDTO };