
const Anthropic = require("@anthropic-ai/sdk");

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are Paw Assistant, a friendly support agent for Pawtrait — a pet portrait studio that creates custom painted/illustrated portraits of pets.
You help customers:
- Choose a portrait style (watercolor, oil, sketch, cartoon, etc.)
- Answer questions about orders, shipping, and delivery times
- Give tips on how to photograph their pet for the best portrait result
- Explain pricing and customization options
Keep answers short, warm, and helpful. Use occasional pet-related emojis 🐾🐶🐱.`;

async function getAiReply(history) {
  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 300,
    system: SYSTEM_PROMPT,
    messages: history,
  });
  return response.content[0].text;
}

module.exports = { getAiReply };
