const { getAiReply } = require("../chat/aiAgent");
const { sendSuccess, sendError } = require("../middleware/errorHandler");
const productService = require("../services/productService");
const cartService = require("../services/cartService");
const orderService = require("../services/orderService");

//(resets on server restart).
const conversations = {};

// Static context: the product catalog, so the assistant can answer "what do you sell" accurately.
async function buildProductsContext() {
  const products = await productService.getAllProducts();
  if (!products.length) return "";
  const lines = products.map((p) => `- ${p.name} — $${p.price} (product_id: ${p.product_id})`);
  return `Current products in the Pawtrait store:\n${lines.join("\n")}`;
}

// Personal context: this user's cart and order history, so the assistant can answer
// "what's in my cart" / "where's my order" without guessing.
async function buildUserContext(userId) {
  const [{ item_cart }, orders] = await Promise.all([
    cartService.getCartPayloadByUserId(userId),
    orderService.getAllOrdersById(userId),
  ]);

  const parts = [];

  if (item_cart.length) {
    const lines = item_cart.map(
      (line) => `- ${line.product_name || "Product"} x${line.quantity} ($${line.price ?? "?"} each)`
    );
    parts.push(`This customer's current cart:\n${lines.join("\n")}`);
  } else {
    parts.push("This customer's cart is currently empty.");
  }

  if (orders.length) {
    const lines = orders.map(
      (o) => `- Order #${o.orderId}: ${o.status}, placed on ${new Date(o.createDate).toLocaleDateString()}`
    );
    parts.push(`This customer's past orders:\n${lines.join("\n")}`);
  } else {
    parts.push("This customer has no past orders.");
  }

  return parts.join("\n\n");
}

async function sendMessage(req, res) {
  const { sessionId, message, userId } = req.body || {};

  if (!sessionId || typeof sessionId !== "string") {
    return sendError(res, 400, "BAD_REQUEST", "sessionId is required", { field: "sessionId" });
  }
  if (!message || typeof message !== "string" || !message.trim()) {
    return sendError(res, 400, "BAD_REQUEST", "message is required", { field: "message" });
  }

  if (!conversations[sessionId]) {
    conversations[sessionId] = [];
  }
  const history = conversations[sessionId];
  history.push({ role: "user", content: message });

  try {
    const contextParts = [await buildProductsContext()];
    if (userId != null) {
      contextParts.push(await buildUserContext(userId));
    }
    const contextText = contextParts.filter(Boolean).join("\n\n");

    const reply = await getAiReply(history, contextText);
    history.push({ role: "assistant", content: reply });
    return sendSuccess(res, { reply });
  } catch (err) {
    console.error("AI chat error:", err.message);
    return sendError(res, 502, "AI_PROVIDER_ERROR", "The AI assistant is unavailable right now", {});
  }
}

module.exports = { sendMessage };
