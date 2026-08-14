import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL.replace("/api", "");

let socket = null;

export const connectSocket = (userId) => {
  if (socket && socket.connected) {
    if (userId) socket.emit("user_online", userId);
    return socket;
  }

  if (socket) {
    socket.disconnect();
  }

  socket = io(SOCKET_URL, {
    withCredentials: true,
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => {
    console.log("Socket connected");
    if (userId) socket.emit("user_online", userId);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default socket;