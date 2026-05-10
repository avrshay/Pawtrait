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

function getAllOrdersById(id){
    return orders.filter(o => o.userId === Number(id));
}

function getAllItemsOrdersById(userId,orderId){
    return items_orders.filter(i => i.userId === Number(userId) && i.orderId === Number(orderId));
}

module.exports = {getAllOrdersById,getAllItemsOrdersById} //Allows another file to use the users variable