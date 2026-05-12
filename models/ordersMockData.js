const orders = [
  {
    orderId: 1,
    userId: 2,
    amount: 60,
    status: "processing",
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
const items_orders = [
  {
    orderId: 1,
    userId: 2,
    productName: "Design mug",
    amount: 60,
    status: "processing",
    createDate: new Date()
  },
  {
    orderId: 2,
    userId: 2,
    productName: "Fabric bag",
    amount: 120,
    status: "completed",
    createDate: new Date()
  },
  {
    orderId: 3,
    userId: 3,
    productName: "Design mug",
    amount: 60,
    status: "processing",
    createDate: new Date()
  }
];

/**
 * Retrieves all summary orders for a specific user.
 * @param {number|string} id - The unique identifier of the user.
 * @returns {Array} An array of order objects belonging to the user.
 */
function getAllOrdersById(id){
    return orders.filter(o => o.userId === Number(id));
}

/**
 * Retrieves specific item details for a particular order belonging to a user.
 * This provides a more granular look at what products were purchased in a single transaction.
 * @param {number|string} userId - The unique identifier of the user.
 * @param {number|string} orderId - The unique identifier of the specific order.
 * @returns {Array} An array of items matching both the user and order IDs.
 */
function getAllItemsOrdersById(userId,orderId){
    return items_orders.filter(i => i.userId === Number(userId) && i.orderId === Number(orderId));
}

module.exports = {getAllOrdersById,getAllItemsOrdersById} //Allows another file to use the users variable