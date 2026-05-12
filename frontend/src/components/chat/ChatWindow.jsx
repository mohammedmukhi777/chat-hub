import { useEffect, useRef, useState } from "react";
import { getSocket } from "../../services/socket";
import useAuthStore from "../../context/authStore";
import useChatStore from "../../context/chatStore";
import api from "../../services/api";
import MessageBubble from "./MessageBubble";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";

function ChatWindow() {
  const { user } = useAuthStore();
  const { activeConversation, messages, fetchMessages, addMessage } = useChatStore();
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const currentConvId = useRef(null);
  const addedMessageIds = useRef(new Set());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!activeConversation) return;

    currentConvId.current = activeConversation._id;
    addedMessageIds.current = new Set();
    fetchMessages(activeConversation._id);

    const socket = getSocket();
    if (socket) {
      socket.emit("join_room", activeConversation._id);

      socket.off("receive_message");
      socket.off("user_typing");

      socket.on("receive_message", (message) => {
        const convId = message.conversationId?.toString();
        const currentId = currentConvId.current?.toString();
        const msgId = message._id?.toString();

        // Only add if same conversation and not already added
        if (convId === currentId && !addedMessageIds.current.has(msgId)) {
          addedMessageIds.current.add(msgId);
          addMessage(message);
        }
      });

      socket.on("user_typing", ({ isTyping }) => {
        setIsTyping(isTyping);
      });
    }

    api.put(`/messages/${activeConversation._id}/seen`);

    return () => {
      if (socket) {
        socket.off("receive_message");
        socket.off("user_typing");
      }
    };
  }, [activeConversation?._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text, imageUrl = "") => {
    if (!text.trim() && !imageUrl) return;

    try {
      await api.post("/messages/send", {
        conversationId: activeConversation._id,
        text,
        imageUrl,
        messageType: imageUrl ? "image" : "text",
      });
      // Message will be added via socket receive_message event
    } catch {
      console.error("Failed to send message");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader isTyping={isTyping} />

    <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#0a0a0f]" style={{
  backgroundImage: `radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.03) 0%, transparent 50%), 
  radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.03) 0%, transparent 50%)`
  }}>
        {messages.map((msg) => {
  const senderId = msg.sender?._id?.toString() || msg.sender?.toString();
  const isOwn = senderId === user._id?.toString();
  return (
    <MessageBubble
      key={msg._id}
      message={msg}
      isOwn={isOwn}
    />
  );
})}
        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="bg-[#1a1a2e] rounded-2xl px-4 py-3 flex gap-1">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSend={sendMessage} />
    </div>
  );
}

export default ChatWindow;