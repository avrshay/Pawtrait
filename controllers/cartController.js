const carts = require("../models/cartsMockData");
const products = require("../models/productsMockData");

// helper- Enrich a cart item with product details: return the item with product name, image, and price.
function enrichLine(line) {
  const p = products.getProductById(line.productId);
  const base = { ...line };
  if (!p) {
    return {
      ...base,
      product_name: null,
      product_image: null,
      price: null,
    };
  }
  return {
    ...base,
    product_name: p.name,
    product_image: p.custom_product_image_url,
    price: p.price,
  };
}

// helper- Check if the current user has permission to access a cart item: return true if authorized, otherwise false.
function canAccessCartItem(req, cart) {
  if (!cart) {
    return false;
  }
  const role = req.headers["x-user-role"];
  if (["admin", "manager"].includes(role)) {
    return true;
  }
  const userId = Number(req.headers["x-user-id"]);
  return Number.isFinite(userId) && cart.user_id === userId;
}

// GET /cart — cart owner from x-user-id header.
function getCart(req, res) {
  const user_id = req.headers["x-user-id"];
  if (!user_id || !Number.isFinite(Number(user_id))) {
    return res.status(400).json({ error: "invalid x-user-id header" });
  }
  const { cart, item_cart } = carts.getCartPayloadByUserId(user_id);
  if (!cart) {
    return res.status(200).json({
      user_id: Number(user_id),
      cartId: null,
      createDate: null,
      item_cart: [],
    });
  }
  const joined = item_cart.map((line) => enrichLine(line));
  return res.status(200).json({
    user_id: cart.user_id,
    cartId: cart.cartId,
    createDate: cart.createDate,
    item_cart: joined,
  });
}

// POST /cart — body: { productId, quantity, petImageUrl }; cart owner from x-user-id header.
function addItem(req, res) {
  const body = req.body || {};
  const user_id = req.headers["x-user-id"];
  const productId = body.productId;
  const quantity = body.quantity;
  const petImageUrl = body.petImageUrl;

  if (!Number.isFinite(Number(user_id))) {
    return res.status(400).json({ error: "invalid x-user-id header" });
  }
  if (!Number.isFinite(Number(productId))) {
    return res.status(400).json({ error: "productId is required" });
  }
  if (!Number.isFinite(Number(quantity)) || Number(quantity) < 1) {
    return res.status(400).json({ error: "quantity must be a positive number" });
  }
  const pet =
    petImageUrl != null ? String(petImageUrl).trim() : "";
  if (!pet) {
    return res.status(400).json({ error: "petImageUrl is required for each cart line" });
  }
  const product = products.getProductById(productId);
  if (!product) {
    return res.status(400).json({ error: `unknown productId: ${productId}` });
  }

  const line = carts.addCartItem(user_id, {
    productId,
    quantity,
    petImageUrl: pet,
  });
  if (!line) {
    return res.status(500).json({ error: "could not add cart item" });
  }
  return res.status(201).json(enrichLine(line));
}


// Update the quantity of a cart item for the given item id.
function updateItemQuantity(req, res) {
  const item_id = req.params.item_id;
  if (!item_id || !Number.isFinite(Number(item_id))) {
    return res.status(400).json({ error: "invalid item_id" });
  }
  const ctx = carts.getCartItemWithOwner(item_id);
  if (!ctx || !ctx.row) {
    return res.status(404).json({ error: "cart item not found" });
  }
  if (!canAccessCartItem(req, ctx.cart)) {
    return res.status(403).json({
      success: false,
      data: null,
      error: {
        code: "FORBIDDEN",
        message: "You do not have permission to perform this action.",
        details: {},
      },
    });
  }

  const qty = req.body && req.body.quantity;
  if (!Number.isFinite(Number(qty)) || Number(qty) < 1) {
    return res.status(400).json({ error: 'body must include quantity (positive number)' });
  }

  const updated = carts.updateCartItemQuantity(item_id, qty);
  if (!updated) {
    return res.status(400).json({ error: "could not update quantity" });
  }
  return res.status(200).json(enrichLine(updated));
}

// Delete a cart item for the given item id.
function deleteItem(req, res) {
  const item_id = req.params.item_id;
  if (!item_id || !Number.isFinite(Number(item_id))) {
    return res.status(400).json({ error: "invalid item_id" });
  }
  const ctx = carts.getCartItemWithOwner(item_id);
  if (!ctx || !ctx.row) {
    return res.status(404).json({ error: "cart item not found" });
  }
  if (!canAccessCartItem(req, ctx.cart)) {
    return res.status(403).json({
      success: false,
      data: null,
      error: {
        code: "FORBIDDEN",
        message: "You do not have permission to perform this action.",
        details: {},
      },
    });
  }
  const ok = carts.deleteCartItem(item_id);
  if (!ok) {
    return res.status(500).json({ error: "could not delete cart item" });
  }
  return res.status(200).json({ cart_item_id: Number(item_id), deleted: true });
}

// DELETE /cart/clear — clears lines for the user in x-user-id header.
function clearCart(req, res) {
  const user_id = req.headers["x-user-id"];
  if (!user_id || !Number.isFinite(Number(user_id))) {
    return res.status(400).json({ error: "invalid x-user-id header" });
  }
  const removed = carts.clearCartByUserId(user_id);
  return res.status(200).json({ user_id: Number(user_id), removed });
}

module.exports = {
  getCart,
  addItem,
  updateItemQuantity,
  deleteItem,
  clearCart,
};
