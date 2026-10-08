const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const doc = new PDFDocument({
  margin: 40,
  size: "A4",
  info: {
    Title: "Chat Hub - Full Stack Interview & Resume Master Guide",
    Author: "Chat Hub Project",
    Subject: "Interview Preparation & CV Guide",
  },
});

const outputPath = path.join(__dirname, "..", "ChatHub_Interview_MasterGuide.pdf");
doc.pipe(fs.createWriteStream(outputPath));

// Colors
const primaryColor = "#0f172a";
const accentColor = "#2563eb";
const secondaryColor = "#475569";
const highlightBg = "#f1f5f9";
const darkText = "#1e293b";

function drawHeader(title) {
  doc.rect(0, 0, doc.page.width, 75).fill(primaryColor);
  doc.fillColor("#ffffff").fontSize(20).font("Helvetica-Bold").text("CHAT HUB | Full-Stack Project Master Guide", 40, 22);
  doc.fontSize(10).font("Helvetica").fillColor("#94a3b8").text("Interview Guide, Architecture, Security, Challenges & Resume Bullet Points", 40, 48);
  doc.moveDown(2);
  doc.y = 95;
}

function drawSectionHeading(heading) {
  doc.moveDown(0.8);
  const currentY = doc.y;
  if (currentY > doc.page.height - 100) {
    doc.addPage();
    drawPageHeader();
  }
  doc.rect(40, doc.y, doc.page.width - 80, 24).fill(highlightBg);
  doc.fillColor(accentColor).fontSize(12).font("Helvetica-Bold").text(heading, 48, doc.y - 18);
  doc.moveDown(0.6);
}

function drawSubHeading(sub) {
  if (doc.y > doc.page.height - 70) {
    doc.addPage();
    drawPageHeader();
  }
  doc.moveDown(0.4);
  doc.fillColor(primaryColor).fontSize(11).font("Helvetica-Bold").text(sub);
  doc.moveDown(0.2);
}

function drawParagraph(text) {
  if (doc.y > doc.page.height - 60) {
    doc.addPage();
    drawPageHeader();
  }
  doc.fillColor(darkText).fontSize(9.5).font("Helvetica").text(text, { lineGap: 3, align: "left" });
  doc.moveDown(0.4);
}

function drawBullet(title, text) {
  if (doc.y > doc.page.height - 60) {
    doc.addPage();
    drawPageHeader();
  }
  doc.font("Helvetica-Bold").fontSize(9.5).fillColor(darkText).text("• " + title + ": ", { continued: true });
  doc.font("Helvetica").fillColor(secondaryColor).text(text, { lineGap: 2.5 });
  doc.moveDown(0.25);
}

function drawPageHeader() {
  doc.rect(0, 0, doc.page.width, 35).fill(primaryColor);
  doc.fillColor("#ffffff").fontSize(10).font("Helvetica-Bold").text("CHAT HUB | Project Architecture & Interview Master Guide", 40, 12);
  doc.y = 50;
}

// PAGE 1
drawHeader();

drawSectionHeading("1. RESUME / CV BULLET POINTS (FAANG / XYZ FORMULA FORMAT)");
drawParagraph("Use these high-impact bullet points on your CV. They follow Google's recommended XYZ formula: 'Accomplished [X] as measured by [Y], by doing [Z]'.");

drawBullet("Real-Time Architecture", "Architected and engineered a full-stack real-time messaging system serving sub-second bidirectional communications using React 19, Node.js, Express 5, and Socket.io with room isolation.");
drawBullet("Security & Authentication", "Integrated Firebase Phone OTP with cryptographic server-side token verification (Firebase Admin SDK) and signed JWT sessions, eliminating password vulnerabilities.");
drawBullet("AI Integration", "Implemented an in-app AI Assistant tab integrating Groq SDK (Llama 3.1 8B Instant) with multi-turn conversation memory, achieving sub-second LLM inference.");
drawBullet("Optimistic UI & Deduplication", "Designed optimistic UI updates in Zustand with a dual-tier deduplication mechanism (client cache check + server 2-second timestamp window), eliminating message race conditions.");
drawBullet("Media Pipeline", "Developed a zero-disk cloud media delivery pipeline using Multer and Cloudinary CDN for instant image previews and secure distributed media hosting.");
drawBullet("Presence & Status Indicators", "Built deterministic online/offline presence tracking and debounced typing indicators using server-side in-memory Map structures and WebSocket event broadcasts.");

drawSectionHeading("2. THE 30-SECOND INTERVIEW ELEVATOR PITCH");
drawParagraph("\"Chat Hub is a full-stack, real-time messaging and AI collaboration platform built with React, Node.js, Express, Socket.io, and MongoDB. It features passwordless phone-based OTP authentication via Firebase, sub-second bidirectional messaging, live typing indicators, online/offline presence detection, media uploads via Cloudinary, and an integrated AI assistant powered by Groq's Llama 3.1 model. I built it to combine the instant responsiveness of modern chat platforms like WhatsApp with native AI-assisted conversational capabilities.\"");

drawSectionHeading("3. PROBLEM STATEMENT & VALUE PROPOSITION");
drawBullet("Frictionless Identity", "Replaced brittle password authentication with SMS OTP verification, reducing bot registrations and login friction.");
drawBullet("Zero-Latency Interaction", "Eliminated HTTP polling overhead with persistent bidirectional WebSocket tunnels for messages, typing, and presence.");
drawBullet("Native AI Co-pilot", "Users can converse with low-latency LLMs without context-switching to third-party tools.");
drawBullet("Scalable Document Storage", "Flexible document model in MongoDB with compound indexing for instant conversation lookup.");

// PAGE 2
doc.addPage();
drawPageHeader();

drawSectionHeading("4. COMPLETE TECH STACK BREAKDOWN");
drawBullet("Frontend", "React 19, Vite (Ultra-fast build & HMR), Zustand (Lightweight 2KB global state), Tailwind CSS (Design tokens), Framer Motion (Fluid animations), Lucide React (Icons).");
drawBullet("Backend", "Node.js (Async event loop), Express 5 (Routing engine), Socket.io (WebSocket room clustering & event broadcasting).");
drawBullet("Database & ODM", "MongoDB Atlas (Distributed NoSQL), Mongoose (Schema validation, populate joins, indexes).");
drawBullet("Cloud & Third-Party APIs", "Firebase Client & Admin SDK (Phone OTP), Cloudinary (Image CDN), Groq Cloud API (Llama 3.1 8B Instant LLM).");

drawSectionHeading("5. DATABASE SCHEMAS & RELATIONSHIPS");
drawSubHeading("A. User Collection");
drawParagraph("Fields: phone (Indexed, unique), name, avatar (DiceBear default), bio, firebaseUid (Indexed, unique), isOnline (Boolean), lastSeen (Date).");

drawSubHeading("B. Conversation Collection");
drawParagraph("Fields: participants ([ObjectId -> User]), lastMessage (ObjectId -> Message), timestamps. Query pattern: Conversation.findOne({ participants: { $all: [userA, userB] } }) ensures unique 1-on-1 threads.");

drawSubHeading("C. Message Collection");
drawParagraph("Fields: conversationId (ObjectId -> Conversation), sender (ObjectId -> User), messageType ('text' | 'image'), text, imageUrl, status ('sent' | 'delivered' | 'seen'), seenBy ([ObjectId -> User]), timestamps.");

drawSectionHeading("6. API & WEBSOCKET EVENT CONTRACT");
drawSubHeading("REST APIs:");
drawBullet("POST /api/auth/verify", "Exchanges Firebase ID token for application-level signed JWT.");
drawBullet("GET /api/auth/me", "Retrieves logged-in user details from JWT claims.");
drawBullet("GET /api/messages/conversations", "Returns user conversation list with populated participant info & last message.");
drawBullet("GET /api/messages/:conversationId", "Fetches message history ordered by createdAt.");
drawBullet("POST /api/messages", "Persists message, updates conversation lastMessage, and triggers socket broadcast.");
drawBullet("PUT /api/messages/seen/:conversationId", "Marks incoming messages as 'seen' for read receipts.");
drawBullet("POST /api/upload/image", "Accepts multipart file, streams to Cloudinary, returns secure CDN URL.");
drawBullet("POST /api/ai/chat", "Accepts message & history array, queries Groq Llama 3.1, returns AI response.");

drawSubHeading("Socket.io Events:");
drawBullet("user_online / disconnect", "Maintains active online user ID set; broadcasts 'online_users'.");
drawBullet("join_room / send_message", "Subscribes client to conversation room; broadcasts 'receive_message'.");
drawBullet("typing_start / typing_stop", "Emits live typing status to other participants in the room.");
drawBullet("message_seen", "Transmits live read receipt updates (double blue ticks).");

// PAGE 3
doc.addPage();
drawPageHeader();

drawSectionHeading("7. SECURITY, SAFETY & BEST PRACTICES");
drawBullet("Two-Tier Token Bridge", "Validates Firebase idToken cryptographically on the server with Admin SDK before issuing custom HMAC-SHA256 JWT tokens.");
drawBullet("JWT Protected Routes", "Custom auth middleware validates Authorization: Bearer <token> and injects req.user on all sensitive endpoints.");
drawBullet("CORS Whitelisting", "Explicit origin whitelist matching production domains (Vercel) and localhost with credentials support.");
drawBullet("Injection Prevention", "Strict Mongoose Schema typing and parameterized queries protect against NoSQL injection.");
drawBullet("No Disk Exposure", "Direct memory-to-cloud streaming (Multer Memory/Cloudinary) prevents disk-space exhaustion and path traversal vulnerabilities.");
drawBullet("Environment Variable Isolation", "All private keys, JWT secrets, and API credentials stored in .env and strictly excluded from Git.");

drawSectionHeading("8. KEY ENGINEERING CHALLENGES & HOW YOU OVERCAME THEM");
drawBullet("Challenge 1: Double Message & Race Conditions", "Resolved by combining optimistic UI rendering with an ID check in Zustand store ('state.messages.some(...)') and a 2-second timestamp deduplication window in backend controller.");
drawBullet("Challenge 2: Presence Flapping on Multiple Tabs/Disconnects", "Implemented an in-memory Map(userId -> socketId) on Node.js to deterministically broadcast unique user IDs across all connected sockets.");
drawBullet("Challenge 3: Typing Indicator Network Flooding", "Implemented client-side debouncing with automatic 2-second idle timeout to stop unnecessary socket emission on every keystroke.");
drawBullet("Challenge 4: AI Context Loss Across Turns", "Built structured conversation memory forwarding previous user and model turns into Groq's chat completion schema.");

drawSectionHeading("9. SYSTEM DESIGN & SCALABILITY (FOR SENIOR INTERVIEWS)");
drawBullet("Scaling to 100k+ Concurrent Connections", "Introduce Redis Pub/Sub with Socket.io Redis Adapter to distribute socket events horizontally across multiple Node.js instances behind an Nginx/AWS ALB load balancer.");
drawBullet("Database Optimization", "Implement cursor-based pagination (using createdAt / _id) for message history and read replicas on MongoDB Atlas.");
drawBullet("End-to-End Encryption (E2EE)", "Implement client-side Web Crypto API (Signal Protocol / AES-GCM + RSA-OAEP) so only encrypted ciphertext reaches the database.");

doc.end();

console.log("PDF successfully generated at: " + outputPath);
