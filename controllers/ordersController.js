const orders = require("../models/ordersMockData");
const products = require("../models/productsMockData");
const { sendSuccess, sendError } = require("../middleware/errorHandler");

function getOrdersOfUserById(req, res) {
  const id = req.params.id;
  const allOrders = orders.getAllOrdersById(id);
  return sendSuccess(res, allOrders);
}

function getItemsOfOrder(req, res) {
  const userId = req.params.id;
  const orderId = req.params.orderId;
  const lines = orders.getAllItemsOrdersById(userId, orderId);
  if (!Array.isArray(lines) || lines.length === 0) {
    return sendError(
      res,
      404,
      "NOT_FOUND",
      "no items found for this order or order not found",
      {}
    );
  }
  return sendSuccess(res, lines);
}

function getOrderById(req, res) {
  const orderId = req.params.id;
  const order = orders.getOrder(orderId);
  if (!order) {
    return sendError(
      res,
      404,
      "NOT_FOUND",
      "order not found",
      {  }
    );
  }
  return sendSuccess(res, order);
}

function createOrder(req, res) {
  const userId = req.params.id;

  const body = req.body || {};
  const items = body.items;
  if (!Array.isArray(items) || items.length === 0) {
    return sendError(res, 400, "BAD_REQUEST", "items must be a non-empty array", {
      field: "items",
    });
  }

  for (const line of items) {
    const pid = line.productId;
    const qty = line.quantity ?? line.amount;
    if (!Number.isFinite(Number(pid)) || !Number.isFinite(Number(qty)) || Number(qty) < 1) {
      return sendError(
        res,
        400,
        "BAD_REQUEST",
        "each item needs productId and a positive quantity",
        { field: "items" }
      );
    }
    const petImageUrl =
      line.petImageUrl != null ? String(line.petImageUrl).trim() : "";
    if (!petImageUrl) {
      return sendError(
        res,
        400,
        "BAD_REQUEST",
        "each item needs petImageUrl (URL or path to the customer's pet photo for that line)",
        { field: "items.petImageUrl" }
      );
    }
    const product = products.getProductById(pid);
    if (!product) {
      return sendError(res, 404, "NOT_FOUND", `product not found: ${pid}`, {
        field: "items.productId",
        productId: pid,
      });
    }
  }

  const status = "processing";
  const newOrder = orders.createOrder({
    userId: Number(userId),
    status,
    createDate: new Date(),
  });

  if (!newOrder) {
    return sendError(res, 500, "INTERNAL_SERVER_ERROR", "could not create order", {});
  }

  for (const line of items) {
    const qty = Number(line.quantity ?? line.amount);
    const petImageUrl = String(line.petImageUrl).trim();
    const itemRow = orders.createItemOrder({
      orderId: newOrder.orderId,
      productId: Number(line.productId),
      quantity: qty,
      petImageUrl,
    });
    if (!itemRow) {
      orders.deleteItemsByOrderId(newOrder.orderId);
      orders.deleteOrder(newOrder.orderId);
      return sendError(res, 500, "INTERNAL_SERVER_ERROR", "failed to persist line items", {});
    }
  }

  return sendSuccess(res, newOrder, 201);
}

function updateOrder(req, res) {
  const userId = req.params.id;
  const orderId = req.params.orderId;

  const list = orders.getAllOrdersById(userId);
  const existing = list.find((o) => o.orderId === Number(orderId));
  if (!existing) {
    return sendError(res, 404, "NOT_FOUND", "order not found", { orderId });
  }

  const body = req.body || {};
  const merged = {
    ...existing,
    userId: body.userId != null ? Number(body.userId) : existing.userId,
    status: body.status != null ? body.status : existing.status,
    createDate: body.createDate != null ? new Date(body.createDate) : existing.createDate,
  };

  if (merged.userId == null || !Number.isFinite(Number(merged.userId))) {
    return sendError(res, 400, "BAD_REQUEST", "invalid userId in body", { field: "userId" });
  }
  if (merged.status == null || String(merged.status).trim() === "") {
    return sendError(res, 400, "BAD_REQUEST", "status is required", { field: "status" });
  }

  const ok = orders.updateOrder(orderId, merged);
  if (!ok) {
    return sendError(res, 500, "INTERNAL_SERVER_ERROR", "update failed", {});
  }

  const allHeaders = orders.getAllOrder();
  const updated = Array.isArray(allHeaders)
    ? allHeaders.find((o) => o.orderId === Number(orderId))
    : null;
  if (!updated) {
    return sendError(res, 500, "INTERNAL_SERVER_ERROR", "order not found after update", {
      orderId: Number(orderId),
    });
  }
  return sendSuccess(res, updated);
}

function deleteOrder(req, res) {
  const userId = req.params.id;
  const orderId = req.params.orderId;

  const list = orders.getAllOrdersById(userId);
  const existing = list.find((o) => o.orderId === Number(orderId));
  if (!existing) {
    return sendError(res, 404, "NOT_FOUND", "order not found", { orderId });
  }

  orders.deleteItemsByOrderId(orderId);
  const removed = orders.deleteOrder(orderId);
  if (!removed) {
    return sendError(res, 500, "INTERNAL_SERVER_ERROR", "failed to delete order", {});
  }

  return sendSuccess(res, { orderId: Number(orderId) });
}

function getAllOrder(req, res) {
  const allOrders = orders.getAllOrder();
  if (!Array.isArray(allOrders)) {
    return sendError(res, 500, "INTERNAL_SERVER_ERROR", "could not load orders", {});
  }
  return sendSuccess(res, allOrders);
}

module.exports = {
  getOrdersOfUserById,
  getItemsOfOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  getAllOrder,
};
