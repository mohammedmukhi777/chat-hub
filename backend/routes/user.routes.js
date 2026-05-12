const express = require("express");
const router = express.Router();
const { getAllUsers, searchUsers, updateProfile } = require("../controllers/user.controller");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/", getAllUsers);
router.get("/search", searchUsers);
router.put("/profile", updateProfile);

module.exports = router;
