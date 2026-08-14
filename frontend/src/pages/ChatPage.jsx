import { useEffect } from "react";
import { connectSocket, disconnectSocket, getSocket } from "../services/socket";
import useAuthStore from "../context/authStore";
import useChatStore from "../context/chatStore";
import Sidebar from "../components/layout/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";
import NoChatSelected from "../components/chat/NoChatSelected";
import SetupProfile from "../components/auth/SetUpProfile";

function ChatPage() {
  const { user, fetchMe } = useAuthStore();
  const { activeConversation, fetchConversations, setOnlineUsers } = useChatStore();

  // Show setup popup if user has no name
  const showSetup = user && (!user.name || user.name === user.phone);

  useEffect(() => {
    fetchConversations();

    const socket = connectSocket(user._id);

    socket.on("connect", () => {
      socket.emit("user_online", user._id);
    });

    socket.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    const interval = setInterval(() => {
      const s = getSocket();
      if (s) s.emit("user_online", user._id);
    }, 5000);

    return () => {
      clearInterval(interval);
      disconnectSocket();
    };
  }, [user._id]);

  return (
    <div className="flex h-[100dvh] w-full bg-[#0a0a0f] text-white overflow-hidden">
      {showSetup && <SetupProfile onComplete={fetchMe} />}
      
      {/* Sidebar: Full width on mobile when no active conversation, fixed width on desktop */}
      <div className={`h-full flex-shrink-0 w-full md:w-80 md:flex ${activeConversation ? "hidden md:flex" : "flex"}`}>
        <Sidebar />
      </div>

      {/* Main Chat Area: Full width on mobile when active conversation, flex-1 on desktop */}
      <div className={`h-full flex-1 flex-col overflow-hidden ${activeConversation ? "flex" : "hidden md:flex"}`}>
        {activeConversation ? <ChatWindow /> : <NoChatSelected />}
      </div>
    </div>
  );
}

export default ChatPage;