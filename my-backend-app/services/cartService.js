const { Cart, CartItem, Product } = require("../models");

//mapping
function enrichLine(line) {
  return {
    ...line.dataValues ? line.dataValues : line,
    cart_item_id: line.id
  };
}

// Get cart payload by user id: return the cart and all items in the cart.
async function getCartPayloadByUserId(userId) {
  const cart = await Cart.findOne({
    where: { userId: Number(userId) },
    include: [{ model: CartItem, include: [Product] }]
  });

  if (!cart) {
    return { cart: null, item_cart: [] };
  }
  const item_cart = cart.CartItems.map(enrichLine);
  return { cart, item_cart };
}

// Ensure a cart for a user: if user has no cart, create one empty.
async function ensureCartForUser(userId) {
  const uid = Number(userId);
  if (!Number.isFinite(uid)) {
    return null;
  }
  let cart = await Cart.findOne({where: { userId: Number(userId) }});
  if (cart) {
    return cart;
  }
  return await Cart.create({userId: Number(userId)});
}

// Get cart item with owner: return the item and the cart it belongs to.
async function getCartItemWithOwner(cartItemId) {
  const id = Number(cartItemId);
  if (!Number.isFinite(id)) {
    return null;
  }
  const row = await CartItem.findByPk(id, {include: [Cart]});
  if (!row) {
    return null;
  }
  return {row,cart: row.Cart};
}

// Add a new cart item to the cart: return the new item if successful, otherwise null.
async function addCartItem(userId, { productId, quantity, petImageUrl }) {
  const cart = await ensureCartForUser(userId);
  if (!cart) {
    return null;
  }
  const q = Number(quantity);
  const pid = Number(productId);
  const pet = petImageUrl?.trim();
  if (!Number.isFinite(q) || q < 1 || !Number.isFinite(pid) || !pet) {
    return null;
  }
  return await CartItem.create({
    cartId: cart.id,
    productId: pid,
    quantity: q,
    petImageUrl: pet
  });
}

// Update the quantity of a cart item: return the updated item if successful, otherwise null.
async function updateCartItemQuantity(cartItemId, quantity) {
  const item = await CartItem.findByPk(cartItemId);
  if (!item) {
    return null;
  }
  const q = Number(quantity);
  if (!Number.isFinite(q) || q < 1) {
    return null;
  }
  await item.update({ quantity: q });
  return item;
}

// Delete a cart item: return true if successful, otherwise false.
async function deleteCartItem(cartItemId) {
  const deleted = await CartItem.destroy({
    where: { id: Number(cartItemId) }
  });
  return (deleted > 0);
}

// Clear a cart: return the number of items removed.
async function clearCartByUserId(userId) {
  const cart = await Cart.findOne({where: { userId: Number(userId) }});
  if (!cart) {
    return 0;
  }
  return await CartItem.destroy({where: { cartId: cart.id }});
}