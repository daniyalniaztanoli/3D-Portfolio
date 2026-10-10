const express = require("express");

const {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
} = require("../controllers/skillController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// =========================
// Public Routes
// =========================

router.get("/", getSkills);

router.get("/:id", getSkill);

// =========================
// Admin Routes
// =========================

// Create Skill
router.post(
  "/",
  protect,
  upload.single("image"),
  createSkill
);

// Update Skill
router.put(
  "/:id",
  protect,
  upload.single("image"),
  updateSkill
);

// Delete Skill
router.delete(
  "/:id",
  protect,
  deleteSkill
);

module.exports = router;