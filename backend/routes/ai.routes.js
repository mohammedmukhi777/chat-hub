const express = require("express");
const router = express.Router();
const { chatWithAI } = require("../controllers/ai.controller");
const { protect } = require("../middleware/auth");

router.use(protect);

router.post("/chat", chatWithAI);

module.exports = router;