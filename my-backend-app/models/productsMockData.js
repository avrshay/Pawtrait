// In-memory product rows for the gallery / catalog (no database).
// product_id is referenced as productId on order line items (foreign key from ordersMockData.items_orders).

const Products = [
    {
      product_id: 1, //primary key
      name: "Designed Cup",
      original_pet_image_url: "http://localhost:3000/images/clients/dog1-original.jpg",
      custom_product_image_url: "http://localhost:3000/images/catalog/products/cup-design-dog1.png",
      price: 50,
    },
    {
      product_id: 2,
      name: "Tote Bag",
      original_pet_image_url: "http://localhost:3000/images/clients/dog2-original.jpg",
      custom_product_image_url: "http://localhost:3000/images/catalog/products/bag-design-dog2.png",
      price: 35,
    },
    {
      product_id: 3,
      name: "Soft Pillow",
      original_pet_image_url: "http://localhost:3000/images/clients/dog3-original.jpg",
      custom_product_image_url: "http://localhost:3000/images/catalog/products/pillow-design-dog3.png",
      price: 65,
    },
    {
      product_id: 4,
      name: "Baseball Cap",
      original_pet_image_url: "http://localhost:3000/images/clients/dog4-original.jpg",
      custom_product_image_url: "http://localhost:3000/images/catalog/products/cap-design-dog4.png",
      price: 55,
      
    }
  ];


// Returns the full Products array (same references the server holds in memory).
function getAllProducts(){
    return Products;
}

// Returns one product object, or false when id is missing/invalid lookup path (caller treats false like "not found").
function getProductById(id){
    if (!id) {
        return false;
    }
    return Products.find(p => p.product_id === Number(id));
}

// Validates required fields; assigns next product_id; returns the new row or null if validation failed.
function createProduct(product){
    if (!product.name || !product.original_pet_image_url || !product.custom_product_image_url || product.price === undefined || product.price === null) {
      return null;
    }
    const nextId = Products.length ? Math.max(...Products.map((p) => p.product_id)) + 1 : 1;
    const newProduct = { ...product, product_id: nextId };
    Products.push(newProduct);
    return newProduct;
}

// Replaces the row for id when validation passes and id exists; returns true/false (no row object).
function updateProduct(id, product){
    if (!product.name || !product.original_pet_image_url || !product.custom_product_image_url || product.price === undefined || product.price === null) {
      return false;
    }
    const index = Products.findIndex(p => p.product_id === Number(id));
    if (index !== -1){
        Products[index] = { ...product, product_id: Number(id) };
        return true;
    }
    return false;
}

// Removes one row by id; returns true if something was deleted, false otherwise.
function deleteProduct(id){
    if (!id) {
        return false;
    }
    const index = Products.findIndex(p => p.product_id === Number(id));
    if (index !== -1){
        Products.splice(index, 1);
        return true;
    }
    return false;
}

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
