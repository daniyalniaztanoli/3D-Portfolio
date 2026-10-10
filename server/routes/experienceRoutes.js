const express = require("express");

const {
  getExperiences,
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
} = require("../controllers/experienceController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// =========================
// Public Routes
// =========================

router.get("/", getExperiences);

router.get("/:id", getExperience);

// =========================
// Admin Routes
// =========================

router.post(
  "/",
  protect,
  upload.single("companyLogo"),
  createExperience
);

router.put(
  "/:id",
  protect,
  upload.single("companyLogo"),
  updateExperience
);

router.delete(
  "/:id",
  protect,
  deleteExperience
);



module.exports = router;