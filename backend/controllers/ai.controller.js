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
      ...history.map((msg) => ({
        role: msg.role === "model" ? "assistant" : "user",
        content: msg.text,
      })),
      { role: "user", content: message },
    ];

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // Free model on Groq
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