const User = require("../models/User");

// GET /api/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select("name phone avatar bio isOnline lastSeen")
      .sort({ isOnline: -1, name: 1 });

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// GET /api/users/search?q=query
const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.json({ users: [] });
    }

    const users = await User.find({
      _id: { $ne: req.user._id },
      $or: [
        { name: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
      ],
    }).select("name phone avatar bio isOnline lastSeen");

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: "Search failed" });
  }
};

// PUT /api/users/profile
const updateProfile = async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, avatar },
      { new: true }
    ).select("-firebaseUid");

    res.json({ user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Profile update failed" });
  }
};

module.exports = { getAllUsers, searchUsers, updateProfile };