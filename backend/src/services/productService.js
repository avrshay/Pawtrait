const { Product } = require("../../models");
const { toProductDTO } = require("../../models/mapper/productMapper");


// Returns the full Products array (same references the server holds in memory).
async function getAllProducts() {
  const products = await Product.findAll();
  return products.map(toProductDTO);
}


// Returns one product object, or false when id is missing/invalid lookup path (caller treats false like "not found").
async function getProductById(id) {
  if (!id) {
    return false;
  }
  return toProductDTO(await Product.findByPk(id));
}


// Validates required fields; assigns next product_id; returns the new row or null if validation failed.
async function createProduct(data) {
  const name = data.name;
  const original_pet_image_url = data.original_pet_image_url;
  const custom_product_image_url = data.custom_product_image_url;
  const price = Number(data.price);
  if (
    !name ||
    !original_pet_image_url ||
    !custom_product_image_url ||
    price === null||
    price === undefined 
  ) {
    return null;
  }
  const newProduct = await Product.create({
    name,
    original_pet_image_url,
    custom_product_image_url,
    price,
  });
  return toProductDTO(newProduct);
}


// Replaces the row for id when validation passes and id exists; returns true/false (no row object).
async function updateProduct(id, data) {
  if (!id) {
    return false;
  }
  const product = await Product.findByPk(id);
  if (!product) {
    return false;
  }
  const name = data.name;
  const original_pet_image_url = data.original_pet_image_url;
  const custom_product_image_url = data.custom_product_image_url;
  const price = Number(data.price);
  if (
    !name ||
    !original_pet_image_url ||
    !custom_product_image_url ||
    price === null||
    price === undefined 
  ) {
    return false;
  }
  await product.update({
    name,
    original_pet_image_url,
    custom_product_image_url,
    price,
  });
  return true;
}


// Removes one row by id; returns true if something was deleted, false otherwise.
async function deleteProduct(id) {
  if (!id) {
    return false;
  }
  const product = await Product.findByPk(id);
  if (!product) {
    return false;
  }
  await product.destroy();
  return true;
}

module.exports = {getAllProducts,getProductById,createProduct,updateProduct,deleteProduct};
