const products = require("../models/productsMockData");

//turn an HTTP request into a call to the model and a proper HTTP + JSON response
function getAllProducts(req, res) {
    const allProducts = products.getAllProducts();
    if (allProducts.length === 0) {
        return res.status(200).json([]);
    }
    res.status(200).json(allProducts);
   
}

function getProductById(req, res) {
    const product_id = req.params.product_id;
    if (!product_id || !Number.isFinite(Number(product_id))) {
        return res.status(400).json({ error: "invalid product_id" });
    }
    const product = products.getProductById(product_id);
    if (!product) {
        return res.status(404).json({ error: "product not found" });
    }
    res.status(200).json(product);
    
}

function createProduct(req, res) {
    const product = req.body;
    if (!product.name || !product.original_pet_image_url || !product.custom_product_image_url || product.price === undefined || product.price === null) {
        return res.status(400).json({ error: "invalid product data" });
    }
    const newProduct = products.createProduct(product);
    if (!newProduct) {
        return res.status(400).json({ error: "failed to create product" });
    }
    res.status(201).json(newProduct);
}
function updateProduct(req, res) {
    const product_id = req.params.product_id;
    if (!product_id || !Number.isFinite(Number(product_id))) {
        return res.status(400).json({ error: "invalid product_id" });
    }
    const product = req.body;
    if (!product.name || !product.original_pet_image_url || !product.custom_product_image_url || product.price === undefined || product.price === null) {
        return res.status(400).json({ error: "invalid product data" });
    }
    const updatedProduct = products.updateProduct(product_id,product);
    if (!updatedProduct) {
        return res.status(404).json({ error: "product not found" });
    }
    res.status(200).json(products.getProductById(product_id));
}
function deleteProduct(req, res) {
    const product_id = req.params.product_id;
    if (!product_id || !Number.isFinite(Number(product_id))) {
        return res.status(400).json({ error: "invalid product_id" });
    }
    const deletedProduct = products.deleteProduct(product_id);
    if (!deletedProduct) {
        return res.status(404).json({ error: "product not found" });
    }
    res.status(200).json({product_id: Number(product_id)});
}

module.exports = {getAllProducts,getProductById,createProduct,updateProduct,deleteProduct};