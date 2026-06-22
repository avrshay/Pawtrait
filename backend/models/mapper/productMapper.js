
// Converts a Product DB object into a simpler object for the frontend:
// renames "id" to "product_id".
function toProductDTO(product) {
  if (!product) return product;
  const { id, ...rest } = product.toJSON();
  return { product_id: id, ...rest };
}

module.exports = { toProductDTO };