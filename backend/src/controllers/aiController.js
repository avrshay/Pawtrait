const productService = require("../services/productService");
const orderService = require("../services/orderService");

/**
 * Mock AI: turns the pet photo into a product design URL.
 * Replace this with a real HTTP call to your AI provider when ready.
 */
async function generateDesignForLineItem({ petImageUrl, productId }) {
  const product = await productService.getProductById(productId);
  if (product && product.custom_product_image_url) {
    return product.custom_product_image_url;
  }
  const stamp = Date.now();
  return `http://localhost:3000/models/images/designs/ai-order-${productId}-${stamp}.png`;
}

// Goes through every line item of an order and generates a design image
// for any line that doesn't have one yet.
async function processOrderItems(orderId) {
  const lines = await orderService.getItemsByOrderId(orderId);
  for (const line of lines) {
    const current =
      line.aiDesignImageUrl != null ? String(line.aiDesignImageUrl).trim() : "";
    if (current) {
      continue;
    }
    const designUrl = await generateDesignForLineItem({
      petImageUrl: line.petImageUrl,
      productId: line.productId,
    });
    await orderService.setAiDesignImageUrl(line.id, designUrl);
  }
}

// Runs processOrderItems in the background (doesn't block the caller) and logs any error.
function enqueueOrderAiProcessing(orderId) {
  setImmediate(() => {
    processOrderItems(orderId).catch((err) => {
      console.error(`AI processing failed for order ${orderId}:`, err.message);
    });
  });
}

module.exports = {
  generateDesignForLineItem,
  processOrderItems,
  enqueueOrderAiProcessing,
};
