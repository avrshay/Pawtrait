//mapping
function enrichLine(line) {
  return {
    ...(line.dataValues ? line.dataValues : line),
    cart_item_id: line.id
  };
}

module.exports = { enrichLine };