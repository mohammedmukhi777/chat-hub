const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const chatWithAI = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Build messages array for Groq
    const messages = [
      { role: "system", content: "You are a helpful AI assistant inside a chat app called Chat Hub." },
      ...history
        .filter((msg) => msg && (msg.text || msg.content))
        .map((msg) => ({
          role: msg.role === "model" || msg.role === "assistant" ? "assistant" : "user",
          content: String(msg.text || msg.content || ""),
        })),
      { role: "user", content: message },
    ];

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages,
      max_tokens: 1024,
    });

    const reply = response.choices[0]?.message?.content || "No response";

    res.json({ response: reply });
  } catch (error) {
    console.error("Groq error:", error.message);
    res.status(500).json({ message: "AI response failed" });
  }
};

module.exports = { chatWithAI };