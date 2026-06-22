// Local Ollama server

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434/api/chat";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.2";

const SYSTEM_PROMPT = `You are Paw Assistant, a friendly support agent for Pawtrait — a pet portrait studio that creates custom painted/illustrated portraits of pets.
You help customers:
- Answer questions about orders, shipping, and delivery times
- Give tips on how to photograph their pet for the best portrait result
- Explain pricing and customization options
Keep answers short, warm, and helpful. Use occasional pet-related emojis 🐾🐶🐱.`;

// Sends the chat history (+ optional extra context) to the local Ollama AI model
// and returns the text of its reply.
async function getAiReply(history, contextText) {
  const systemContent = contextText ? `${SYSTEM_PROMPT}\n\n${contextText}` : SYSTEM_PROMPT;
  const response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      stream: false,
      messages: [{ role: "system", content: systemContent }, ...history],
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama request failed (${response.status})`);
  }

  const data = await response.json();
  return data.message.content;
}

module.exports = { getAiReply };
