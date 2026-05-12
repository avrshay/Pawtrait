const Products = [
    {
      product_id: 1,
      name: "designed_cup",
      original_pet_image_url: "/images/clients/dog1-original.jpg",
      custom_product_image_url: "/images/products/cup-design-dog1.png",
      price: 50,
    },
    {
      product_id: 2,
      name: "tote_bag",
      original_pet_image_url: "/images/clients/dog2-original.jpg",
      custom_product_image_url: "/images/products/bag-design-dog2.png",
      price: 35,
    },
    {
      product_id: 3,
      name: "soft_pillow",
      original_pet_image_url: "/images/clients/dog3-original.jpg",
      custom_product_image_url: "/images/products/pillow-design-dog3.png",
      price: 65,
    },
    {
      product_id: 4,
      name: "baseball_cap",
      original_pet_image_url: "/images/clients/dog4-original.jpg",
      custom_product_image_url: "/images/products/cap-design-dog4.png",
      price: 55,
      
    }
  ];


function getAllProducts(){
    return Products;
}

function getProductById(id){
    return Products.find(p => p.product_id === Number(id));
}

//admin only functions:
function createProduct(product){
    Products.push(product);
}

function updateProduct(id,product){
    const index = Products.findIndex(p => p.product_id === Number(id));
    if (index !== -1){
        Products[index] = product;
        return true;
    }
    return false;
}
function deleteProduct(id){
    const index = Products.findIndex(p => p.product_id === Number(id));
    if (index !== -1){
        Products.splice(index, 1);
        return true;
    }
    return false;
}

module.exports = {getAllProducts,getProductById,createProduct,updateProduct,deleteProduct} //Allows another file to use the products variable