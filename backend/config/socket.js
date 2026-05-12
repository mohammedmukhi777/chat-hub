const { Server } = require("socket.io");

const onlineUsers = new Map();

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // User comes online
    socket.on("user_online", (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit("online_users", Array.from(onlineUsers.keys()));
    });

    // Join a conversation room
    socket.on("join_room", (roomId) => {
      socket.join(roomId);
    });

    // Send message
    // Send message - only broadcast to OTHERS in the room, not sender
    socket.on("send_message", (messageData) => {
      socket.to(messageData.conversationId).emit("receive_message", messageData);
    });

    // Typing indicators
    socket.on("typing_start", ({ conversationId, userId }) => {
      socket.to(conversationId).emit("user_typing", { userId, isTyping: true });
    });

    socket.on("typing_stop", ({ conversationId, userId }) => {
      socket.to(conversationId).emit("user_typing", { userId, isTyping: false });
    });

    // Message seen
    socket.on("message_seen", ({ conversationId, messageId, seenBy }) => {
      socket.to(conversationId).emit("message_seen_update", { messageId, seenBy });
    });

    // User disconnects
    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          io.emit("online_users", Array.from(onlineUsers.keys()));
          break;
        }
      }
    });
  });

  return io;
};

module.exports = { initSocket };