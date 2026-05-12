import { create } from "zustand";
import api from "../services/api";

const useChatStore = create((set, get) => ({
  conversations: [],
  activeConversation: null,
  messages: [],
  onlineUsers: [],
  isLoadingMessages: false,

  setOnlineUsers: (users) => set({ onlineUsers: users }),

  setActiveConversation: (conversation) => set({ activeConversation: conversation }),

  fetchConversations: async () => {
    try {
      const res = await api.get("/messages/conversations");
      set({ conversations: res.data.conversations });
    } catch {
      console.error("Failed to fetch conversations");
    }
  },

  fetchMessages: async (conversationId) => {
    try {
      set({ isLoadingMessages: true });
      const res = await api.get(`/messages/${conversationId}`);
      set({ messages: res.data.messages, isLoadingMessages: false });
    } catch {
      set({ isLoadingMessages: false });
    }
  },

  addMessage: (message) => {
    set((state) => {
      const exists = state.messages.some((m) => m._id?.toString() === message._id?.toString());
      if (exists) return state;
      return { messages: [...state.messages, message] };
    });
  },

  updateConversation: (message) => {
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv._id === message.conversationId
          ? { ...conv, lastMessage: message, updatedAt: Date.now() }
          : conv
      ),
    }));
  },
}));

export default useChatStore;