const express = require("express");
const router = express.Router();
const {
  getOrCreateConversation,
  getUserConversations,
  getMessages,
  sendMessage,
  markAsSeen,
} = require("../controllers/message.controller");
const { protect } = require("../middleware/auth");

router.use(protect);

router.post("/conversation", getOrCreateConversation);
router.get("/conversations", getUserConversations);
router.get("/:conversationId", getMessages);
router.post("/send", sendMessage);
router.put("/:conversationId/seen", markAsSeen);

module.exports = router;