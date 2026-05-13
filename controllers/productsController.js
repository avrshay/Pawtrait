const products = require("../models/productsMockData");

// Maps HTTP requests to productsMockData and sends JSON + status codes (no assignment envelope format here).

// GET /gallery — list all products; empty list is still 200 with [].
function getAllProducts(req, res) {
    const allProducts = products.getAllProducts();
    if (allProducts.length === 0) {
        return res.status(200).json([]);
    }
    res.status(200).json(allProducts);
   
}

// GET /gallery/:product_id — 400 for non-numeric id, 404 if no row, 200 with the product JSON.
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

// POST /gallery (admin) — body must include name, both image URLs, price; 201 returns the created row including product_id.
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
// PUT /gallery/:product_id (admin) — body same shape as create; 404 if id missing in store; 200 returns fresh row from model.
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
// DELETE /gallery/:product_id (admin) — 404 if nothing deleted; 200 returns { product_id }.
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
