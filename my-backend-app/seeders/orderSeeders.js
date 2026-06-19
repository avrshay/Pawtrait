await queryInterface.bulkInsert("Orders", [
  {
    userId: 2,
    status: "processing",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: 3,
    status: "completed",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]);