const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { initSocket } = require("./config/socket");

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);

app.use(cors({
 origin: [
  "http://localhost:5173",
  "https://chat-hub-dm6c.vercel.app",
  "https://chat-hub-dm6c-git-main-mohammed-mukhi-s-projects.vercel.app",
  "https://chat-hub-dm6c-qpqhy51qo-mohammed-mukhi-s-projects.vercel.app"
],
  credentials: true
}));
app.use(express.json());

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const messageRoutes = require("./routes/message.routes");
const uploadRoutes = require("./routes/upload.routes");
const aiRoutes = require("./routes/ai.routes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/ai", aiRoutes);

app.get("/api/health", (req, res) => {
  res.json({ message: "Chat Hub API is running 🚀" });
});

const io = initSocket(server);
app.set("io", io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});