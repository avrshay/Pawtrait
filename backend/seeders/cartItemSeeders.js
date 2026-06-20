await queryInterface.bulkInsert("CartItems", [
  {
    cartId: 1,
    productId: 2,
    quantity: 1,
    petImageUrl: "...",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    cartId: 1,
    productId: 3,
    quantity: 2,
    petImageUrl: "...",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    cartId: 2,
    productId: 1,
    quantity: 1,
    petImageUrl: "...",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
]);