const orders = require("../models/ordersMockData");
const products = require("../models/productsMockData");

// GET /orders/:id — all order headers for this user (auth: self or admin/manager).
function getOrdersOfUserById(req, res) {
  const id= req.params.id;
  if (!id || !Number.isFinite(Number(id))) {
    return res.status(400).json({ error: "invalid user id" });
  }
  const allOrders = orders.getAllOrdersById(id);
  res.status(200).json(allOrders);
}

// GET /orders/:id/:orderId — line items for one order of this user (auth: self or admin/manager).
// Each item: { id, orderId, productId, quantity, petImageUrl } with orderId FK → order, productId FK → catalog.
function getItemsOfOrder(req, res) {
  const userId= req.params.id;
  if (!userId || !Number.isFinite(Number(userId))) {
    return res.status(400).json({ error: "invalid user id" });
  }
  const orderId = req.params.orderId;
  if (!orderId || !Number.isFinite(Number(orderId))) {
    return res.status(400).json({ error: "invalid order id" });
  }
  const lines = orders.getAllItemsOrdersById(userId,orderId);
  if (!Array.isArray(lines) || lines.length === 0) {
    return res.status(404).json({ error: "no items found for this order or order not found" });
  }
  res.status(200).json(lines);
}


// POST /orders/:id — Body: { items: [{ productId, quantity, petImageUrl }] } (petImageUrl = customer pet photo URL per line).
// productId must exist in productsMockData. Status is "processing"; rolls back if any line fails.
function createOrder(req, res) {
  const userId = req.params.id;
  if (!userId || !Number.isFinite(Number(userId))) {
    return res.status(400).json({ error: "invalid user id" });
  }

  const body = req.body || {};
  const items = body.items;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "items must be a non-empty array" });
  }

  for (const line of items) {
    const pid = line.productId;
    const qty = line.quantity ?? line.amount;
    if (!Number.isFinite(Number(pid)) || !Number.isFinite(Number(qty)) || Number(qty) < 1) {
      return res.status(400).json({ error: "each item needs productId and a positive quantity" });
    }
    const petImageUrl =
      line.petImageUrl != null ? String(line.petImageUrl).trim() : "";
    if (!petImageUrl) {
      return res.status(400).json({
        error: "each item needs petImageUrl (URL or path to the customer's pet photo for that line)",
      });
    }
    const product = products.getProductById(pid);
    if (!product) {
      return res.status(400).json({ error: `unknown productId: ${pid}` });
    }
  }

  const status = "processing";
  const newOrder = orders.createOrder({
    userId: Number(userId),
    status,
    createDate: new Date(),
  });

  if (!newOrder) {
    return res.status(400).json({ error: "could not create order" });
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
      return res.status(500).json({ error: "failed to persist line items" });
    }
  }

  return res.status(201).json(newOrder);
}

// PUT /orders/:id/:orderId — update order header only (userId, status, createDate). No quantity on order.
// Quantities live on line items (separate endpoints / model functions if you add them later).
function updateOrder(req, res) {
  const userId = req.params.id;
  const orderId = req.params.orderId;
  if (!userId || !Number.isFinite(Number(userId)) || !orderId || !Number.isFinite(Number(orderId))) {
    return res.status(400).json({ error: "invalid user id or order id" });
  }

  const list = orders.getAllOrdersById(userId);
  const existing = list.find((o) => o.orderId === Number(orderId));
  if (!existing) {
    return res.status(404).json({ error: "order not found" });
  }

  const body = req.body || {};
  const merged = {
    ...existing,
    userId: body.userId != null ? Number(body.userId) : existing.userId,
    status: body.status != null ? body.status : existing.status,
    createDate: body.createDate != null ? new Date(body.createDate) : existing.createDate,
  };

  if (merged.userId == null || !Number.isFinite(Number(merged.userId))) {
    return res.status(400).json({ error: "invalid userId in body" });
  }
  if (merged.status == null || String(merged.status).trim() === "") {
    return res.status(400).json({ error: "status is required" });
  }

  const ok = orders.updateOrder(orderId, merged);
  if (!ok) {
    return res.status(400).json({ error: "update failed" });
  }

  const updatedList = orders.getAllOrdersById(userId);
  if (!updatedList) {
    return res.status(404).json({ error: "orders not found" });
  }
  if (!Array.isArray(updatedList) || updatedList.length === 0) {
    return res.status(404).json({ error: "no items found for this order" });
  }
  const updated = updatedList.find((o) => o.orderId === Number(orderId));
  if (!updated) {
    return res.status(404).json({ error: "order not found" });
  }
  if (!updated.userId || !Number.isFinite(Number(updated.userId))) {
    return res.status(400).json({ error: "invalid userId in body" });
  }
  if (updated.status == null || String(updated.status).trim() === "") {
    return res.status(400).json({ error: "status is required" });
  } 
  if (updated.createDate == null || !Date.parse(updated.createDate)) {
    return res.status(400).json({ error: "createDate is required" });
  }
  return res.status(200).json(updated);
}

// DELETE /orders/:id/:orderId — remove order and all its line items (must belong to user :id).
function deleteOrder(req, res) {
  const userId = req.params.id;
  const orderId = req.params.orderId;
  if (!userId || !Number.isFinite(Number(userId)) || !orderId || !Number.isFinite(Number(orderId))) {
    return res.status(400).json({ error: "invalid user id or order id" });
  }

  const list = orders.getAllOrdersById(userId);
  const existing = list.find((o) => o.orderId === Number(orderId));
  if (!existing) {
    return res.status(404).json({ error: "order not found" });
  }

  orders.deleteItemsByOrderId(orderId);
  const removed = orders.deleteOrder(orderId);
  if (!removed) {
    return res.status(500).json({ error: "failed to delete order" });
  }

  return res.status(200).json({ orderId: Number(orderId) });
}

module.exports = { getOrdersOfUserById,getItemsOfOrder,createOrder,updateOrder,deleteOrder };
