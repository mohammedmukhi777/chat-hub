import { useState, useRef, useEffect } from "react";
import { Send, Trash2, ArrowLeft, Sparkles } from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../context/authStore";

function AIPage() {
  const { user } = useAuthStore();
  const savedMessages = JSON.parse(localStorage.getItem(`ai_chat_${user._id}`) || "[]");

  const [messages, setMessages] = useState(
    savedMessages.length > 0 ? savedMessages : [
      { role: "model", text: "Hi! I'm your AI assistant powered by Groq. Ask me anything! 🤖" },
    ]
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(`ai_chat_${user._id}`, JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    try {
      const history = updatedMessages.slice(1, -1);
      const res = await api.post("/ai/chat", { message: input, history });
      setMessages([...updatedMessages, { role: "model", text: res.data.response }]);
    } catch {
      toast.error("AI failed to respond");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    const initial = [{ role: "model", text: "Hi! I'm your AI assistant powered by Groq. Ask me anything! 🤖" }];
    setMessages(initial);
    localStorage.removeItem(`ai_chat_${user._id}`);
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0a0a0f] text-white">

      {/* Fixed Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-[#0f0f13] border-b border-white/5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">AI Assistant</p>
            <p className="text-indigo-400 text-xs">Powered by Groq • Always online</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} message-enter`}>
            {msg.role === "model" && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-2 flex-shrink-0 self-end shadow-lg shadow-indigo-500/20">
                <Sparkles size={14} className="text-white" />
              </div>
            )}
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === "user"
                ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-br-sm shadow-lg shadow-indigo-500/10"
                : "bg-white/5 border border-white/10 text-white rounded-bl-sm"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 message-enter">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles size={14} className="text-white" />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Input */}
      <div className="sticky bottom-0 px-4 py-3 bg-[#0f0f13] border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-white/5 border border-white/10 focus-within:border-indigo-500/50 rounded-2xl px-4 py-2.5 transition">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask AI anything..."
              className="w-full bg-transparent text-white text-sm outline-none placeholder-gray-600"
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl transition disabled:opacity-40 shadow-lg shadow-indigo-500/20"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIPage;