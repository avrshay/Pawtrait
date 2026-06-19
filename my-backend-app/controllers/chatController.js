const { getAiReply } = require("../chat/aiAgent");
const { sendSuccess, sendError } = require("../middleware/errorHandler");

//(resets on server restart).
const conversations = {};

async function sendMessage(req, res) {
  const { sessionId, message } = req.body || {};

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
    const reply = await getAiReply(history);
    history.push({ role: "assistant", content: reply });
    return sendSuccess(res, { reply });
  } catch (err) {
    console.error("AI chat error:", err.message);
    return sendError(res, 502, "AI_PROVIDER_ERROR", "The AI assistant is unavailable right now", {});
  }
}

module.exports = { sendMessage };
