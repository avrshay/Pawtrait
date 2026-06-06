// In-memory shopping carts
const carts = [
  {
    cartId: 1, //primary key
    user_id: 2, //foreign key to users table
    createDate: new Date("2026-01-10T10:00:00.000Z"), //date and time of creation
  },
  {
    cartId: 2,
    user_id: 3,
    createDate: new Date("2026-01-11T14:30:00.000Z"),
  },
];

const cart_items = [
  {
    cart_item_id: 1, //primary key
    id: 1, //primary key
    orderId: 1, //foreign key to carts table
    productId: 2, //foreign key to products table
    quantity: 1,
    petImageUrl: "http://localhost:3000/images/clients/cart-user2-bag-pet.jpg",
    createDate: new Date("2026-01-10T10:05:00.000Z"), //date and time of creation
  },
  {
    cart_item_id: 2,
    id: 2,
    orderId: 1,
    productId: 3,
    quantity: 2,
    petImageUrl: "http://localhost:3000/images/clients/cart-user2-pillow-pet.jpg",
    createDate: new Date("2026-01-10T10:08:00.000Z"),
  },
  {
    cart_item_id: 3,
    id: 2,
    orderId: 2,
    productId: 1,
    quantity: 1,
    petImageUrl: "http://localhost:3000/images/clients/cart-user3-cup-pet.jpg",
    createDate: new Date("2026-01-11T15:00:00.000Z"),
  },
];

// Find a cart by user id: return the cart if found, otherwise null.
function findCartByUserId(user_id) {
  const uid = Number(user_id);
  if (!Number.isFinite(uid)) {
    return null;
  }
  return carts.find((c) => c.user_id === uid) || null;
}

// Find a cart by cart id: return the cart if found, otherwise null.
function findCartByCartId(cartId) {
  const cid = Number(cartId);
  if (!Number.isFinite(cid)) {
    return null;
  }
  return carts.find((c) => c.cartId === cid) || null;
}

// Ensure a cart for a user: if user has no cart, create one empty.
function ensureCartForUser(user_id) {
  const uid = Number(user_id);
  if (!Number.isFinite(uid)) {
    return null;
  }
  let cart = findCartByUserId(uid);
  if (cart) {
    return cart;
  }
  const nextCartId = carts.length ? Math.max(...carts.map((c) => c.cartId)) + 1 : 1;
  cart = { cartId: nextCartId, user_id: uid, createDate: new Date() };
  carts.push(cart);
  return cart;
}

// Find cart items by cart id: return all items in the cart.
function getCartItemsByCartId(cartId) {
  const cid = Number(cartId);
  if (!Number.isFinite(cid)) {
    return [];
  }
  return cart_items.filter((i) => i.orderId === cid);
}

// Get cart payload by user id: return the cart and all items in the cart.
function getCartPayloadByUserId(user_id) {
  const cart = findCartByUserId(user_id);
  if (!cart) {
    return { cart: null, item_cart: [] };
  }
  return { cart, item_cart: getCartItemsByCartId(cart.cartId) };
}

// Get cart item with owner: return the item and the cart it belongs to.
function getCartItemWithOwner(cart_item_id) {
  const id = Number(cart_item_id);
  if (!Number.isFinite(id)) {
    return null;
  }
  const row = cart_items.find((i) => i.cart_item_id === id || i.id === id);
  if (!row) {
    return null;
  }
  const cart = findCartByCartId(row.orderId);
  if (!cart) {
    return { row, cart: null };
  }
  return { row, cart };
}

// Add a new cart item to the cart: return the new item if successful, otherwise null.
function addCartItem(user_id, { productId, quantity, petImageUrl }) {
  const cart = ensureCartForUser(user_id);
  if (!cart) {
    return null;
  }
  const q = Number(quantity);
  if (!Number.isFinite(q) || q < 1) {
    return null;
  }
  const pet =
    petImageUrl != null ? String(petImageUrl).trim() : "";
  if (!pet) {
    return null;
  }
  const pid = Number(productId);
  if (!Number.isFinite(pid)) {
    return null;
  }
  const nextLineId = cart_items.length
    ? Math.max(...cart_items.map((i) => i.cart_item_id)) + 1
    : 1;
  const line = {
    cart_item_id: nextLineId,
    id: nextLineId,
    orderId: cart.cartId,
    productId: pid,
    quantity: q,
    petImageUrl: pet,
    createDate: new Date(),
  };
  cart_items.push(line);
  return line;
}

// Update the quantity of a cart item: return the updated item if successful, otherwise null.
function updateCartItemQuantity(cart_item_id, quantity) {
  const id = Number(cart_item_id);
  const q = Number(quantity);
  if (!Number.isFinite(id) || !Number.isFinite(q) || q < 1) {
    return null;
  }
  const index = cart_items.findIndex((i) => i.cart_item_id === id || i.id === id);
  if (index === -1) {
    return null;
  }
  cart_items[index] = { ...cart_items[index], quantity: q };
  return cart_items[index];
}

// Delete a cart item: return true if successful, otherwise false.
function deleteCartItem(cart_item_id) {
  const id = Number(cart_item_id);
  if (!Number.isFinite(id)) {
    return false;
  }
  const index = cart_items.findIndex((i) => i.cart_item_id === id || i.id === id);
  if (index === -1) {
    return false;
  }
  cart_items.splice(index, 1);
  return true;
}

// Clear a cart: return the number of items removed.
function clearCartByUserId(user_id) {
  const cart = findCartByUserId(user_id);
  if (!cart) {
    return 0;
  }
  const cid = cart.cartId;
  let removed = 0;
  for (let i = cart_items.length - 1; i >= 0; i--) {
    if (cart_items[i].orderId === cid) {
      cart_items.splice(i, 1);
      removed += 1;
    }
  }
  return removed;
}

module.exports = {
  findCartByUserId,
  ensureCartForUser,
  getCartPayloadByUserId,
  getCartItemWithOwner,
  addCartItem,
  updateCartItemQuantity,
  deleteCartItem,
  clearCartByUserId,
};
