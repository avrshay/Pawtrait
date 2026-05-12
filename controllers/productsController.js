const products = require("../models/productsMockData");

//turn an HTTP request into a call to the model and a proper HTTP + JSON response
function getAllProducts(req, res) {
    const allProducts = products.getAllProducts();
    if (allProducts.length === 0) {
        return res.status(200).json({ error: "products not found" });
    }
    res.status(200).json(allProducts);
   
}

function getProductById(req, res) {
    const product_id = req.params.product_id;
    if (!product_id) {
        return res.status(400).json({ error: "product_id is required" });
    }
    const product = products.getProductById(product_id);
    if (!product) {
        return res.status(404).json({ error: "product not found" });
    }
    res.status(200).json(product);
    
}

function createProduct(req, res) {
    const product = req.body;
    if (!product.name || !product.original_pet_image_url || !product.custom_product_image_url || !product.price) {
        return res.status(400).json({ error: "invalid product data" });
    }
    const newProduct = products.createProduct(product);
    if (!newProduct) {
        return res.status(400).json({ error: "failed to create product" });
    }
    res.status(201).json(product);
}
function updateProduct(req, res) {
    const product_id = req.params.product_id;
    if (!product_id) {
        return res.status(400).json({ error: "product_id is required" });
    }
    if (!product.name || !product.original_pet_image_url || !product.custom_product_image_url || !product.price) {
        return res.status(400).json({ error: "invalid product data" });
    }
    const product = req.body;
    const updatedProduct = products.updateProduct(product_id,product);
    if (!updatedProduct) {
        return res.status(400).json({ error: "failed to update product" });
    }
    res.status(200).json(product);
}
function deleteProduct(req, res) {
    const product_id = req.params.product_id;
    if (!product_id) {
        return res.status(400).json({ error: "product_id is required" });
    }
    const deletedProduct = products.deleteProduct(product_id);
    if (!deletedProduct) {
        return res.status(400).json({ error: "failed to delete product" });
    }
    res.status(200).json({product_id: product_id});
}

module.exports = {getAllProducts,getProductById,createProduct,updateProduct,deleteProduct};