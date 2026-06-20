const cartService = require("../services/cartService");
const { sendSuccess, sendError } = require("../middleware/errorHandler");

function enrichLine(line) {
  const base = { ...line };

  return {
    ...base,
    cart_item_id: line.id,

    product_name: line.Product?.name || null,
    product_image: line.Product?.custom_product_image_url || null,
    price: line.Product?.price || null,
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
  return Number.isFinite(userId) && cart.userId === userId;
}

async function getCart(req, res) {
  const user_id = req.headers["x-user-id"];
  const { cart, item_cart } =await cartService.getCartPayloadByUserId(user_id);
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
    user_id: cart.userId,
    cartId: cart.id,
    createDate: cart.createdAt,
    item_cart: joined,
  });
}

async function addItem(req, res) {
  const body = req.body || {};
  const user_id = req.headers["x-user-id"];

  const productId = body.productId;
  const quantity = body.quantity;
  const petImageUrl = String(body.petImageUrl).trim();

  const line = await cartService.addCartItem(user_id, {
    productId,
    quantity,
    petImageUrl,
  });
  if (!line) {
    return sendError(res, 500, "INTERNAL_SERVER_ERROR", "could not add cart item", {});
  }
  return sendSuccess(res, enrichLine(line), 201);
}

async function updateItemQuantity(req, res) {
  const item_id = req.params.item_id;
  const ctx = await cartService.getCartItemWithOwner(item_id);
  if (!ctx || !ctx.row) {
    return sendError(res, 404, "NOT_FOUND", "cart item not found", { item_id });
  }
  if (!canAccessCartItem(req, ctx.cart)) {
    return sendError(res, 403, "FORBIDDEN", "You do not have permission to perform this action.", {});
  }

  const qty = req.body.quantity;
  const updated = await cartService.updateCartItemQuantity(item_id, qty);
  if (!updated) {
    return sendError(res, 500, "INTERNAL_SERVER_ERROR", "could not update quantity", {});
  }
  return sendSuccess(res, enrichLine(updated));
}

async function deleteItem(req, res) {
  const item_id = req.params.item_id;
  const ctx = await cartService.getCartItemWithOwner(item_id);
  if (!ctx || !ctx.row) {
    return sendError(res, 404, "NOT_FOUND", "cart item not found", { item_id });
  }
  if (!canAccessCartItem(req, ctx.cart)) {
    return sendError(res, 403, "FORBIDDEN", "You do not have permission to perform this action.", {});
  }
  const ok = await cartService.deleteCartItem(item_id);
  if (!ok) {
    return sendError(res, 500, "INTERNAL_SERVER_ERROR", "could not delete cart item", {});
  }
  return sendSuccess(res, { cart_item_id: Number(item_id), deleted: true });
}

async function clearCart(req, res) {
  const user_id = req.headers["x-user-id"];
  const removed = await cartService.clearCartByUserId(user_id);
  return sendSuccess(res, { user_id: Number(user_id), removed });
}

module.exports = {
  getCart,
  addItem,
  updateItemQuantity,
  deleteItem,
  clearCart,
};
