// Takes a cart item (from the DB or a plain object) and adds a "cart_item_id" field
// (copied from its "id") so the frontend gets a clearer field name.
function enrichLine(line) {
  return {
    ...(line.dataValues ? line.dataValues : line),
    cart_item_id: line.id
  };
}

module.exports = { enrichLine };