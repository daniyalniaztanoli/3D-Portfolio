
const express = require("express");

const {
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/profileController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Public: Get profile
router.get("/", getProfile);

// Dono files receive hongi:
// profileImage = Profile picture
// resume = CV PDF
const profileUpload = upload.fields([
  { name: "profileImage", maxCount: 1 },
  { name: "resume", maxCount: 1 },
]);

// Admin: Create profile
router.post("/", protect, profileUpload, createProfile);

// Admin: Update profile
router.put("/", protect, profileUpload, updateProfile);

// Admin: Delete profile
router.delete("/", protect, deleteProfile);

module.exports = router;