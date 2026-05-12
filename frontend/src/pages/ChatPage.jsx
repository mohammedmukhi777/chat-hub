import { useEffect } from "react";
import { connectSocket, disconnectSocket, getSocket } from "../services/socket";
import useAuthStore from "../context/authStore";
import useChatStore from "../context/chatStore";
import Sidebar from "../components/layout/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";
import NoChatSelected from "../components/chat/NoChatSelected";
import SetupProfile from "../components/auth/SetupProfile";

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
    <div className="flex h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {showSetup && <SetupProfile onComplete={fetchMe} />}
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeConversation ? <ChatWindow /> : <NoChatSelected />}
      </div>
    </div>
  );
}

export default ChatPage;