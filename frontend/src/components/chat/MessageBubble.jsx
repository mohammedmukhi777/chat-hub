import { format } from "date-fns";
import { Check, CheckCheck } from "lucide-react";

function MessageBubble({ message, isOwn }) {
  const time = format(new Date(message.createdAt), "HH:mm");

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} message-enter mb-1`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
          isOwn
            ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-br-sm shadow-lg shadow-indigo-500/10"
            : "bg-white/5 border border-white/10 text-white rounded-bl-sm"
        }`}
      >
        {/* Image */}
        {message.messageType === "image" && message.imageUrl && (
          <img
            src={message.imageUrl}
            alt="sent image"
            className="rounded-xl max-w-full mb-2 max-h-64 object-cover cursor-pointer hover:opacity-90 transition"
            onClick={() => window.open(message.imageUrl, "_blank")}
          />
        )}

        {/* Text */}
        {message.text && (
          <p className="text-sm leading-relaxed break-words">{message.text}</p>
        )}

        {/* Time + status */}
        <div className={`flex items-center gap-1 mt-1 ${isOwn ? "justify-end" : "justify-start"}`}>
          <span className={`text-xs ${isOwn ? "text-white/50" : "text-gray-600"}`}>{time}</span>
          {isOwn && (
            <span>
              {message.status === "seen" ? (
                <CheckCheck size={12} className="text-blue-300" />
              ) : (
                <Check size={12} className="text-white/50" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;