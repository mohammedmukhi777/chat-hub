const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

const getOrCreateConversation = async (req, res) => {
  try {
    const { recipientId } = req.body;
    const currentUserId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [currentUserId, recipientId] },
    })
      .populate("participants", "name phone avatar bio isOnline lastSeen")
      .populate("lastMessage");

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [currentUserId, recipientId],
      });
      conversation = await Conversation.findById(conversation._id)
        .populate("participants", "name phone avatar bio isOnline lastSeen")
        .populate("lastMessage");
    }

    res.json({ conversation });
  } catch (error) {
    res.status(500).json({ message: "Failed to get/create conversation" });
  }
};

const getUserConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate("participants", "name phone avatar bio isOnline lastSeen")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.json({ conversations });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
};

const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId })
      .populate("sender", "name avatar")
      .sort({ createdAt: 1 });

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { conversationId, text, messageType = "text", imageUrl } = req.body;
    const senderId = req.user._id;

    let message = await Message.create({
      conversationId,
      sender: senderId,
      text,
      messageType,
      imageUrl,
      status: "sent",
    });

    message = await Message.findById(message._id).populate("sender", "name avatar");

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      updatedAt: Date.now(),
    });

    // Emit to all users in the room including sender
    const io = req.app.get("io");
    if (io) {
      io.to(conversationId).emit("receive_message", message);
    }

    res.status(201).json({ message });
  } catch (error) {
    res.status(500).json({ message: "Failed to send message" });
  }
};

const markAsSeen = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    await Message.updateMany(
      {
        conversationId,
        sender: { $ne: userId },
        seenBy: { $ne: userId },
      },
      {
        $addToSet: { seenBy: userId },
        $set: { status: "seen" },
      }
    );

    res.json({ message: "Messages marked as seen" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update seen status" });
  }
};

module.exports = {
  getOrCreateConversation,
  getUserConversations,
  getMessages,
  sendMessage,
  markAsSeen,
};