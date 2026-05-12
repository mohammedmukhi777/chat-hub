import { MessageSquare, Search, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";

function NoChatSelected() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#0a0a0f] relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]" />

      <div className="relative text-center px-8 max-w-sm">

        {/* Icon */}
        <div className="w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
          <MessageSquare size={40} className="text-indigo-400" />
        </div>

        <h2 className="text-white text-2xl font-bold mb-2">Welcome to Chat Hub</h2>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          Select a conversation from the sidebar or search for a user to start a new chat
        </p>

        {/* Feature hints */}
        <div className="space-y-3 text-left">
          <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3 border border-white/5">
            <div className="w-8 h-8 bg-indigo-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Search size={14} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">Find People</p>
              <p className="text-gray-600 text-xs">Search by name or phone number</p>
            </div>
          </div>

          <div
            onClick={() => navigate("/ai")}
            className="flex items-center gap-3 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-2xl px-4 py-3 border border-indigo-500/20 cursor-pointer hover:from-indigo-600/20 hover:to-purple-600/20 transition"
          >
            <div className="w-8 h-8 bg-indigo-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Bot size={14} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">AI Assistant</p>
              <p className="text-gray-600 text-xs">Chat with Groq AI — always available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoChatSelected;