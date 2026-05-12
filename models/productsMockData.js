const Products = [
    {
      product_id: 1,
      name: "designed_cup",
      original_pet_image_url: "http://localhost:3000/images/clients/dog1-original.jpg",
      custom_product_image_url: "http://localhost:3000/images/catalog/products/cup-design-dog1.png",
      price: 50,
    },
    {
      product_id: 2,
      name: "tote_bag",
      original_pet_image_url: "http://localhost:3000/images/clients/dog2-original.jpg",
      custom_product_image_url: "http://localhost:3000/images/catalog/products/bag-design-dog2.png",
      price: 35,
    },
    {
      product_id: 3,
      name: "soft_pillow",
      original_pet_image_url: "http://localhost:3000/images/clients/dog3-original.jpg",
      custom_product_image_url: "http://localhost:3000/images/catalog/products/pillow-design-dog3.png",
      price: 65,
    },
    {
      product_id: 4,
      name: "baseball_cap",
      original_pet_image_url: "http://localhost:3000/images/clients/dog4-original.jpg",
      custom_product_image_url: "http://localhost:3000/images/catalog/products/cap-design-dog4.png",
      price: 55,
      
    }
  ];


function getAllProducts(){
    return Products;
}

function getProductById(id){
    if (!id) {
        return false;
    }
    return Products.find(p => p.product_id === Number(id));
}

function createProduct(product){
    if (!product.name || !product.original_pet_image_url || !product.custom_product_image_url || product.price === undefined || product.price === null) {
      return null;
    }
    const nextId = Products.length ? Math.max(...Products.map((p) => p.product_id)) + 1 : 1;
    const newProduct = { ...product, product_id: nextId };
    Products.push(newProduct);
    return newProduct;
}

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