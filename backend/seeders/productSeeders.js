await queryInterface.bulkInsert("Products", [
  {
    name: "Designed Cup",
    original_pet_image_url: "http://localhost:3000/images/clients/dog1-original.jpg",
    custom_product_image_url: "http://localhost:3000/images/catalog/products/cup-design-dog1.png",
    price: 50,
  },
  {
    name: "Tote Bag",
    original_pet_image_url: "http://localhost:3000/images/clients/dog2-original.jpg",
    custom_product_image_url: "http://localhost:3000/images/catalog/products/bag-design-dog2.png",
    price: 35,
  },
  {
    name: "Soft Pillow",
    original_pet_image_url: "http://localhost:3000/images/clients/dog3-original.jpg",
    custom_product_image_url: "http://localhost:3000/images/catalog/products/pillow-design-dog3.png",
    price: 65,
  },
  {
    name: "Baseball Cap",
    original_pet_image_url: "http://localhost:3000/images/clients/dog4-original.jpg",
    custom_product_image_url: "http://localhost:3000/images/catalog/products/cap-design-dog4.png",
  },
]);