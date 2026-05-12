import { useEffect, useState } from "react";
import { Search, LogOut, MessageSquare, Sparkles } from "lucide-react";      //there was Bot,  in this line before MessageSquare
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../context/authStore";
import useChatStore from "../../context/chatStore";
import api from "../../services/api";
import toast from "react-hot-toast";
import ConversationItem from "../chat/ConversationItem";

function Sidebar() {
  const { user, logout } = useAuthStore();
  const { conversations, fetchConversations, setActiveConversation, activeConversation } = useChatStore();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleSearch = async (q) => {
    setSearch(q);
    if (!q.trim()) return setSearchResults([]);
    try {
      setIsSearching(true);
      const res = await api.get(`/users/search?q=${q}`);
      setSearchResults(res.data.users);
    } catch {
      toast.error("Search failed");
    } finally {
      setIsSearching(false);
    }
  };

  const startChat = async (recipientId) => {
    try {
      const res = await api.post("/messages/conversation", { recipientId });
      setActiveConversation(res.data.conversation);
      setSearch("");
      setSearchResults([]);
    } catch {
      toast.error("Failed to open chat");
    }
  };

  return (
    <div className="w-80 bg-[#0f0f13] flex flex-col border-r border-white/5">

      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <MessageSquare size={16} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Chat Hub</h1>
        </div>

        {/* User info */}
        <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-3 border border-white/5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white font-semibold text-sm truncate">{user?.name || "You"}</p>
            <p className="text-gray-500 text-xs truncate">{user?.phone}</p>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-green-500 text-xs">Online</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2.5 border border-white/5 focus-within:border-indigo-500/50 transition">
          <Search size={15} className="text-gray-500 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="bg-transparent text-white text-sm outline-none flex-1 placeholder-gray-600"
          />
        </div>
      </div>

      {/* Conversations or Search Results */}
      <div className="flex-1 overflow-y-auto">
        {search ? (
          <div className="p-2">
            <p className="text-gray-600 text-xs px-2 py-1.5 uppercase tracking-wider">Search Results</p>
            {searchResults.length === 0 && !isSearching && (
              <p className="text-gray-600 text-sm px-2 py-4 text-center">No users found</p>
            )}
            {searchResults.map((u) => (
              <div
                key={u._id}
                onClick={() => startChat(u._id)}
                className="flex items-center gap-3 px-3 py-3 hover:bg-white/5 cursor-pointer transition rounded-xl"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {u.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{u.name}</p>
                  <p className="text-gray-500 text-xs">{u.phone}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-2">
            <p className="text-gray-600 text-xs px-2 py-1.5 uppercase tracking-wider">Recent Chats</p>
            {conversations.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600 text-sm">No conversations yet</p>
                <p className="text-gray-700 text-xs mt-1">Search for users to start chatting</p>
              </div>
            )}
            {conversations.map((conv) => (
              <ConversationItem
                key={conv._id}
                conversation={conv}
                isActive={activeConversation?._id === conv._id}
                onClick={() => setActiveConversation(conv)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="p-3 border-t border-white/5 space-y-1">

        {/* AI Assistant Button */}
        <button
          onClick={() => navigate("/ai")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-indigo-600/20 to-purple-600/20 hover:from-indigo-600/30 hover:to-purple-600/30 border border-indigo-500/20 hover:border-indigo-500/40 transition group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition">
            <Sparkles size={16} className="text-white" />
          </div>
          <div className="text-left">
            <p className="text-white text-sm font-semibold">AI Assistant</p>
            <p className="text-indigo-400 text-xs">Powered by Groq</p>
          </div>
        </button>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition group"
        >
          <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition">
            <LogOut size={16} className="text-red-400" />
          </div>
          <div className="text-left">
            <p className="text-red-400 text-sm font-semibold">Logout</p>
            <p className="text-gray-600 text-xs">Sign out of Chat Hub</p>
          </div>
        </button>

      </div>
    </div>
  );
}

export default Sidebar;