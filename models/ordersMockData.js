// In-memory mock orders and line items (no DB; data resets when the server restarts).
// Consumed by the orders routes/controllers for listing a user's orders and items in an order.

const orders = [
  {
    orderId: 1, //primary key
    userId: 2, //forgein key to users table
    amount: 60,
    status: "processing", //enum: processing, completed, cancelled
    createDate: new Date()
  },
  {
    orderId: 2,
    userId: 2,
    amount: 120,
    status: "completed",
    createDate: new Date()
  },
  {
    orderId: 3,
    userId: 3,
    amount: 60,
    status: "processing",
    createDate: new Date()
  }
];
// Line-item rows linked to orders (and products); shape mirrors future order_items / order lines table.
const items_orders = [
  {
    id: 1, //primary key
    orderId: 1, //forgein key to orders table
    productId: 1, //forgein key to products table
    amount: 1,
    
  },
  {
    id: 2,
    orderId: 2,
    productId: 2,
    amount: 1,

  },
  {
    id: 3,
    orderId: 3,
    productId: 3,
    amount: 2,
  }
];

// All order headers for a given user id; empty array if id is missing.
function getAllOrdersById(id){
    if (!id) {
      return [];
    }
    return orders.filter(o => o.userId === Number(id));
}

// Line items filtered by userId and orderId (both required); empty array if either is missing.
function getAllItemsOrdersById(userId,orderId){
  if (!userId || !orderId) {
    return [];
  }
  return items_orders.filter(i => i.userId === Number(userId) && i.orderId === Number(orderId));
}

module.exports = {getAllOrdersById,getAllItemsOrdersById} //Allows another file to use the users variable
