const cart = require("../models/cartsMockData");
const products = require("../models/productsMockData");
const { sendSuccess, sendError } = require("../middleware/errorHandler");

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

function getCart(req, res) {
  const user_id = req.headers["x-user-id"];
  const { cart, item_cart } = carts.getCartPayloadByUserId(user_id);
  if (!cart) {
    return sendSuccess(res, {
      user_id: Number(user_id),
      cartId: null,
      createDate: null,
      item_cart: [],
    });
  }
  const joined = item_cart.map((line) => enrichLine(line));
  return sendSuccess(res, {
    user_id: cart.user_id,
    cartId: cart.cartId,
    createDate: cart.createDate,
    item_cart: joined,
  });
}

function addItem(req, res) {
  const body = req.body || {};
  const user_id = req.headers["x-user-id"];
  const productId = body.productId;
  const quantity = body.quantity;
  const petImageUrl = String(body.petImageUrl).trim();

  const product = products.getProductById(productId);
  if (!product) {
    return sendError(res, 404, "NOT_FOUND", `product not found: ${productId}`, {
      field: "productId",
      productId,
    });
  }

  const line = carts.addCartItem(user_id, {
    productId,
    quantity,
    petImageUrl,
  });
  if (!line) {
    return sendError(res, 500, "INTERNAL_SERVER_ERROR", "could not add cart item", {});
  }
  return sendSuccess(res, enrichLine(line), 201);
}

function updateItemQuantity(req, res) {
  const item_id = req.params.item_id;
  const ctx = carts.getCartItemWithOwner(item_id);
  if (!ctx || !ctx.row) {
    return sendError(res, 404, "NOT_FOUND", "cart item not found", { item_id });
  }
  if (!canAccessCartItem(req, ctx.cart)) {
    return sendError(res, 403, "FORBIDDEN", "You do not have permission to perform this action.", {});
  }

  const qty = req.body.quantity;
  const updated = carts.updateCartItemQuantity(item_id, qty);
  if (!updated) {
    return sendError(res, 500, "INTERNAL_SERVER_ERROR", "could not update quantity", {});
  }
  return sendSuccess(res, enrichLine(updated));
}

function deleteItem(req, res) {
  const item_id = req.params.item_id;
  const ctx = carts.getCartItemWithOwner(item_id);
  if (!ctx || !ctx.row) {
    return sendError(res, 404, "NOT_FOUND", "cart item not found", { item_id });
  }
  if (!canAccessCartItem(req, ctx.cart)) {
    return sendError(res, 403, "FORBIDDEN", "You do not have permission to perform this action.", {});
  }
  const ok = carts.deleteCartItem(item_id);
  if (!ok) {
    return sendError(res, 500, "INTERNAL_SERVER_ERROR", "could not delete cart item", {});
  }
  return sendSuccess(res, { cart_item_id: Number(item_id), deleted: true });
}

function clearCart(req, res) {
  const user_id = req.headers["x-user-id"];
  const removed = carts.clearCartByUserId(user_id);
  return sendSuccess(res, { user_id: Number(user_id), removed });
}

module.exports = {
  getCart,
  addItem,
  updateItemQuantity,
  deleteItem,
  clearCart,
};
