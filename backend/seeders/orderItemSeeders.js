await queryInterface.bulkInsert("OrderItems", [
  {
    orderId: 1,
    productId: 1,
    quantity: 1,
    petImageUrl: "...",
    aiDesignImageUrl: "...",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
]);