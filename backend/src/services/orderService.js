const { Order, OrderItem } = require("../../models");

// All order headers for a given user id; empty array if id is missing.
async function getAllOrdersById(id) {
  if (!id) {
    return [];
  }
  return await Order.findAll({where: { userId: Number(id) }});
}

// get order by id
async function getOrderById(orderId) {
  if (orderId == null) {
    return null;
  }
  return await Order.findByPk(orderId);
}

// Line items for an order that belongs to userId (validates ownership via orders table, then filters by orderId).
async function getAllItemsOrdersById(userId, orderId) {
  if (!userId || !orderId) {
    return [];
  }
  const order = await Order.findOne({where: {id: Number(orderId),userId: Number(userId)}});
  if (!order) {
    return [];
  }
  return await OrderItem.findAll({where: {orderId: Number(orderId)},  include: [{model: Product}]
  });
}

// Append a new order; assigns the next orderId. Requires userId and status only (no quantity on order row).
async function createOrder(order) {
  if (!order.userId || !order.status) {
    return null;
  }
  return await Order.create({userId: Number(order.userId),status: order.status, createdAt: new Date()});
}

// Append a new order line; assigns the next line id. Requires orderId, productId, quantity, petImageUrl (non-empty string).
async function createItemOrder(itemOrder) {
  if (!itemOrder.orderId ||!itemOrder.productId ||itemOrder.quantity == null) {
    return null;
  }
  const petUrl =itemOrder.petImageUrl != null? String(itemOrder.petImageUrl).trim(): "";
  if (!petUrl) {
    return null;
  }
  const q = Number(itemOrder.quantity);
  if (!Number.isFinite(q) || q < 1) {
    return null;
  }
  return await OrderItem.create({
    orderId: Number(itemOrder.orderId),
    productId: Number(itemOrder.productId),
    quantity: q,
    petImageUrl: petUrl,
    aiDesignImageUrl: ""
  });
}

//admin/manager can see all orders
async function getAllOrder() {
  return await Order.findAll();
}

// Replace an existing order row when orderId exists; merges with previous row (order has no amount field).
async function updateOrder(orderId, order) {

  if (!orderId ||order.userId == null ||order.status == null ||String(order.status).trim() === "") {
    return false;
  }
  const existing = await Order.findByPk(orderId);
  if (!existing) {
    return false;
  }
  await existing.update({
    userId: Number(order.userId),
    status: order.status
  });
  return true;
}

// Replace an existing line item when id exists; otherwise false. petImageUrl required (non-empty string).
async function updateItemOrder(id, itemOrder) {
  if (!id ||!itemOrder.orderId ||!itemOrder.productId ||itemOrder.quantity == null) {
    return false;
  }
  const petUrl =
    itemOrder.petImageUrl != null? String(itemOrder.petImageUrl).trim(): "";
  if (!petUrl) {
    return false;
  }
  const q = Number(itemOrder.quantity);
  if (!Number.isFinite(q) || q < 1) {
    return false;
  }
  const existing = await OrderItem.findByPk(id);
  if (!existing) {
    return false;
  }
  await existing.update({
    orderId: Number(itemOrder.orderId),
    productId: Number(itemOrder.productId),
    quantity: q,
    petImageUrl: petUrl,
    aiDesignImageUrl:
      itemOrder.aiDesignImageUrl != null
        ? String(itemOrder.aiDesignImageUrl)
        : existing.aiDesignImageUrl
  });
  return true;
}

// All items of an order
async function getItemsByOrderId(orderId) {
  if (orderId == null) {
    return [];
  }
  return await OrderItem.findAll({ where: {orderId: Number(orderId)}});
}

// set AI image URL
async function setAiDesignImageUrl(lineItemId, url) {
  const id = Number(lineItemId);
  if (!Number.isFinite(id)) {
    return null;
  }
  const item = await OrderItem.findByPk(lineItemId);
  if (!item) {
    return null;
  }
  await item.update({aiDesignImageUrl: url != null ? String(url) : ""});
  return item;
}


// Remove an order by orderId; true if a row was removed.
async function deleteOrder(orderId) {
  if (!orderId) {
    return false;
  }
  const deleted = await Order.destroy({where: {id: Number(orderId)}
  });
  return deleted > 0;
}


// Remove a line item by id; true if a row was removed.
async function deleteItemOrder(id) {
  if (!id) {
    return false;
  }
  const deleted = await OrderItem.destroy({where: {id: Number(id)}
  });
  return deleted > 0;
}


// Remove every line row for an order (e.g. rollback after failed checkout).
async function deleteItemsByOrderId(orderId) {
  await OrderItem.destroy({where: {orderId: Number(orderId)}});
}

module.exports = {
  getAllOrdersById,
  getAllItemsOrdersById,
  getAllOrder,
  getOrderById,
  getItemsByOrderId,
  setAiDesignImageUrl,
  createOrder,
  createItemOrder,
  updateOrder,
  updateItemOrder,
  deleteOrder,
  deleteItemOrder,
  deleteItemsByOrderId,
};

