const jwt = require("jsonwebtoken");
const admin = require("../config/firebase");
const User = require("../models/User");

// Generate JWT token
const generateJWT = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// POST /api/auth/verify
const verifyFirebaseToken = async (req, res) => {
  try {
    const { idToken, name } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "Firebase ID token is required" });
    }

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, phone_number } = decodedToken;

    if (!phone_number) {
      return res.status(400).json({ message: "Phone number not found" });
    }

    // Check if user exists
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
  // Check if phone already exists (different firebase uid)
  user = await User.findOne({ phone: phone_number });
  
  if (!user) {
    user = await User.create({
      firebaseUid: uid,
      phone: phone_number,
      name: name || phone_number,
    });
  } else {
    // Update firebase uid if phone exists
    user.firebaseUid = uid;
    await user.save();
  }
}

    const token = generateJWT(user._id);

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        phone: user.phone,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).json({ message: "Authentication failed" });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = { verifyFirebaseToken, getMe };