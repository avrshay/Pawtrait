// Groq cloud API (OpenAI-compatible) — replaces the local Ollama server for production,
// since a deployed server can't reach a model running on the developer's own machine.

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

// The system prompt is prepended to every chat request sent to the AI model. It defines the AI's role and behavior.
const SYSTEM_PROMPT = `You are Paw Assistant, a friendly support agent for Pawtrait — a pet portrait studio that creates custom painted/illustrated portraits of pets.
You help customers:
- Answer questions about orders, shipping, and delivery times
- Give tips on how to photograph their pet for the best portrait result
- Explain pricing and customization options
Keep answers short, warm, and helpful. Use occasional pet-related emojis 🐾🐶🐱.`;

// Sends the chat history (+ optional extra context) to the Groq AI model
// and returns the text of its reply.
async function getAiReply(history, contextText) {
  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not set");
  }

  const systemContent = contextText ? `${SYSTEM_PROMPT}\n\n${contextText}` : SYSTEM_PROMPT;
  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      stream: false,
      messages: [{ role: "system", content: systemContent }, ...history],
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq request failed (${response.status})`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

module.exports = { getAiReply };
