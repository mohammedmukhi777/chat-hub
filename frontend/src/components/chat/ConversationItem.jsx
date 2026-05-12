import useAuthStore from "../../context/authStore";
import useChatStore from "../../context/chatStore";
import { formatDistanceToNow } from "date-fns";

function ConversationItem({ conversation, isActive, onClick }) {
  const { user } = useAuthStore();
  const { onlineUsers } = useChatStore();

  const other = conversation.participants.find((p) => p._id !== user._id);
  const isOnline = onlineUsers.includes(other?._id?.toString());

  const lastMsg = conversation.lastMessage;
  const lastMsgText = lastMsg?.text || (lastMsg?.imageUrl ? "📷 Image" : "Say hello 👋");
  const lastMsgTime = lastMsg
    ? formatDistanceToNow(new Date(lastMsg.createdAt), { addSuffix: true })
    : "";

  const initials = other?.name
    ? other.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : other?.phone?.slice(-2) || "?";

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition rounded-xl mb-0.5 ${
        isActive
          ? "bg-indigo-600/20 border border-indigo-500/30"
          : "hover:bg-white/5 border border-transparent"
      }`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm ${
          isActive
            ? "bg-gradient-to-br from-indigo-500 to-purple-600"
            : "bg-gradient-to-br from-gray-700 to-gray-600"
        }`}>
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

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <p className="text-white text-sm font-semibold truncate">
            {other?.name || other?.phone}
          </p>
          <p className="text-gray-600 text-xs flex-shrink-0 ml-2">{lastMsgTime}</p>
        </div>
        <p className="text-gray-500 text-xs truncate">{lastMsgText}</p>
      </div>
    </div>
  );
}

export default ConversationItem;