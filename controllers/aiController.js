const products = require("../models/productsMockData");
const orders = require("../models/ordersMockData");

/**
 * Mock AI: turns the pet photo into a product design URL.
 * Replace this with a real HTTP call to your AI provider when ready.
 */
async function generateDesignForLineItem({ petImageUrl, productId }) {
  const product = products.getProductById(productId);
  if (product && product.custom_product_image_url) {
    return product.custom_product_image_url;
  }
  const stamp = Date.now();
  return `http://localhost:3000/models/images/designs/ai-order-${productId}-${stamp}.png`;
}

async function processOrderItems(orderId) {
  const lines = orders.getItemsByOrderId(orderId);
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
    orders.setAiDesignImageUrl(line.id, designUrl);
  }
}

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
