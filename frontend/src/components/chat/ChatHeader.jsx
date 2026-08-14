import { Phone, Video, MoreVertical, X, ArrowLeft } from "lucide-react";
import useAuthStore from "../../context/authStore";
import useChatStore from "../../context/chatStore";

function ChatHeader({ isTyping }) {
  const { user } = useAuthStore();
  const { activeConversation, onlineUsers, setActiveConversation } = useChatStore();

  const other = activeConversation?.participants?.find((p) => p._id !== user._id);
  const isOnline = onlineUsers.includes(other?._id?.toString());

  const initials = other?.name
    ? other.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : other?.phone?.slice(-2) || "?";

  return (
    <div className="flex items-center justify-between px-3 md:px-4 py-3 bg-[#0f0f13] border-b border-white/5 flex-shrink-0">
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        {/* Mobile Back Button */}
        <button
          onClick={() => setActiveConversation(null)}
          className="md:hidden w-9 h-9 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition flex-shrink-0"
          aria-label="Back to conversations"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            {other?.avatar ? (
              <img src={other.avatar} className="w-full h-full rounded-xl object-cover" />
            ) : (
              initials
            )}
          </div>
          {isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0f0f13]" />
          )}
        </div>
        <div>
          <p className="text-white font-semibold text-sm">{other?.name || other?.phone}</p>
          <p className="text-xs">
            {isTyping ? (
              <span className="text-indigo-400">typing...</span>
            ) : isOnline ? (
              <span className="text-green-400">Online</span>
            ) : (
              <span className="text-gray-500">Offline</span>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition">
          <Phone size={18} />
        </button>
        <button className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition">
          <Video size={18} />
        </button>
        <button className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition">
          <MoreVertical size={18} />
        </button>
        <button
          onClick={() => setActiveConversation(null)}
          className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;