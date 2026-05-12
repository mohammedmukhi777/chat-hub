const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { upload } = require("../config/cloudinary");

router.use(protect);

router.post("/image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image provided" });
  }
  res.json({ imageUrl: req.file.path });
});

module.exports = router;