const express = require("express");
const router = express.Router();
const { verifyFirebaseToken, getMe } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth");

// POST /api/auth/verify
router.post("/verify", verifyFirebaseToken);

// GET /api/auth/me
router.get("/me", protect, getMe);

module.exports = router;