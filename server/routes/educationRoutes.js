const express = require("express");

const {
  getEducations,
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} = require("../controllers/educationController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// =========================
// Public Routes
// =========================

router.get("/", getEducations);

router.get("/:id", getEducation);

// =========================
// Admin Routes
// =========================

router.post(
  "/",
  protect,
  upload.single("institutionLogo"),
  createEducation
);

router.put(
  "/:id",
  protect,
  upload.single("institutionLogo"),
  updateEducation
);

router.delete(
  "/:id",
  protect,
  deleteEducation
);

module.exports = router;