// In-memory mock orders and line items (no DB; data resets when the server restarts).
// Consumed by the orders routes/controllers for listing a user's orders and items in an order.

// Order headers: 
const orders = [
  {
    orderId: 1, //primary key
    userId: 2, //foreign key to users table
    status: "processing", //enum: processing, completed, cancelled
    createDate: new Date()
  },
  {
    orderId: 2,
    userId: 3,
    status: "completed",
    createDate: new Date()
  },
  {
    orderId: 3,
    userId: 3,
    status: "processing",
    createDate: new Date()
  }
];
// Order line items:
const items_orders = [
  {
    id: 1, //primary key
    orderId: 1, //foreign key to orders table
    productId: 1, //foreign key to products table
    quantity: 1,
    petImageUrl: "http://localhost:3000/images/clients/dog1-original.jpg",
    aiDesignImageUrl: "http://localhost:3000/images/catalog/products/pillow-design-dog3.png",
  },
  {
    id: 2,
    orderId: 2,
    productId: 2,
    quantity: 1,
    petImageUrl: "http://localhost:3000/images/clients/dog2-original.jpg",
    aiDesignImageUrl: "http://localhost:3000/images/catalog/products/bag-design-dog2.png",
  },
  {
    id: 3,
    orderId: 3,
    productId: 3,
    quantity: 2,
    petImageUrl: "http://localhost:3000/images/clients/dog3-original.jpg",
    aiDesignImageUrl: "http://localhost:3000/images/catalog/products/pillow-design-dog3.png",
  }
];


// All order headers for a given user id; empty array if id is missing.
function getAllOrdersById(id){
    if (!id) {
      return [];
    }
    return orders.filter(o => o.userId === Number(id));
}
function getOrder(id){
    if (!id) {
      return [];
    }
    return orders.filter(o => o.orderId === Number(id));
}
// Line items for an order that belongs to userId (validates ownership via orders table, then filters by orderId).
function getAllItemsOrdersById(userId,orderId){
  if (!userId || !orderId) {
    return [];
  }
  const order = orders.find(
    (o) => o.orderId === Number(orderId) && o.userId === Number(userId)
  );
  if (!order) {
    return [];
  }
  return items_orders.filter((i) => i.orderId === Number(orderId));
}

// Append a new order; assigns the next orderId. Requires userId and status only (no quantity on order row).
function createOrder(order){
  if (!order.userId || !order.status) {
    return null;
  }
  const nextId = orders.length ? Math.max(...orders.map(o => o.orderId)) + 1 : 1;
  const newOrder = { ...order, orderId: nextId };
  orders.push(newOrder);
  return newOrder;
}

// Append a new order line; assigns the next line id. Requires orderId, productId, quantity, petImageUrl (non-empty string).
function createItemOrder(itemOrder){
  if (!itemOrder.orderId || !itemOrder.productId || itemOrder.quantity == null) {
    return null;
  }
  const petUrl =
    itemOrder.petImageUrl != null ? String(itemOrder.petImageUrl).trim() : "";
  if (!petUrl) {
    return null;
  }
  const q = Number(itemOrder.quantity);
  if (!Number.isFinite(q) || q < 1) {
    return null;
  }
  const nextId = items_orders.length ? Math.max(...items_orders.map(i => i.id)) + 1 : 1;
  const newItemOrder = {
    orderId: Number(itemOrder.orderId),
    productId: Number(itemOrder.productId),
    quantity: q,
    petImageUrl: petUrl,
    aiDesignImageUrl: "",
    id: nextId,
  };
  items_orders.push(newItemOrder);
  return newItemOrder;
}

//admin/manager can see all orders
function getAllOrder(){
  return orders;
}

// Replace an existing order row when orderId exists; merges with previous row (order has no amount field).
function updateOrder(orderId, order){
  if (!orderId || order.userId == null || order.status == null || String(order.status).trim() === "") {
    return false;
  }
  const index = orders.findIndex(o => o.orderId === Number(orderId));
  if (index !== -1){
    const prev = orders[index];
    orders[index] = {
      ...prev,
      ...order,
      orderId: Number(orderId),
      userId: Number(order.userId),
    };
    return true;
  }
  return false;
}

// Replace an existing line item when id exists; otherwise false. petImageUrl required (non-empty string).
function updateItemOrder(id, itemOrder){
  if (!id || !itemOrder.orderId || !itemOrder.productId || itemOrder.quantity == null) {
    return false;
  }
  const petUrl =
    itemOrder.petImageUrl != null ? String(itemOrder.petImageUrl).trim() : "";
  if (!petUrl) {
    return false;
  }
  const q = Number(itemOrder.quantity);
  if (!Number.isFinite(q) || q < 1) {
    return false;
  }
  const index = items_orders.findIndex(i => i.id === Number(id));
  if (index !== -1){
    const prev = items_orders[index];
    items_orders[index] = {
      orderId: Number(itemOrder.orderId),
      productId: Number(itemOrder.productId),
      quantity: q,
      petImageUrl: petUrl,
      aiDesignImageUrl:
        itemOrder.aiDesignImageUrl != null
          ? String(itemOrder.aiDesignImageUrl)
          : prev.aiDesignImageUrl != null
            ? String(prev.aiDesignImageUrl)
            : "",
      id: Number(id),
    };
    return true;
  }
  return false;
}

function getOrderById(orderId) {
  if (orderId == null) {
    return null;
  }
  return orders.find((o) => o.orderId === Number(orderId)) || null;
}

function getItemsByOrderId(orderId) {
  if (orderId == null) {
    return [];
  }
  return items_orders.filter((i) => i.orderId === Number(orderId));
}

function setAiDesignImageUrl(lineItemId, url) {
  const id = Number(lineItemId);
  if (!Number.isFinite(id)) {
    return null;
  }
  const index = items_orders.findIndex((i) => i.id === id);
  if (index === -1) {
    return null;
  }
  items_orders[index] = {
    ...items_orders[index],
    aiDesignImageUrl: url != null ? String(url) : "",
  };
  return items_orders[index];
}

// Remove an order by orderId; true if a row was removed.
function deleteOrder(orderId){
  if (!orderId) {
    return false;
  }
  const index = orders.findIndex(o => o.orderId === Number(orderId));
  if (index !== -1){
    orders.splice(index, 1);
    return true;
  }
  return false;
}

// Remove a line item by id; true if a row was removed.
function deleteItemOrder(id){
  if (!id) {
    return false;
  }
  const index = items_orders.findIndex(i => i.id === Number(id));
  if (index !== -1){
    items_orders.splice(index, 1);
    return true;
  }
  return false;
}

// Remove every line row for an order (e.g. rollback after failed checkout).
function deleteItemsByOrderId(orderId){
  const oid = Number(orderId);
  for (let i = items_orders.length - 1; i >= 0; i--) {
    if (items_orders[i].orderId === oid) {
      items_orders.splice(i, 1);
    }
  }
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
