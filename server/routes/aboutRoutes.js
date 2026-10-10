const express = require("express");

const {
  getAbout,
  createAbout,
  updateAbout,
  deleteAbout,
} = require("../controllers/aboutController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Public
router.get("/", getAbout);

// Admin
router.post(
  "/",
  protect,
  upload.single("image"),
  createAbout
);

router.put(
  "/",
  protect,
  upload.single("image"),
  updateAbout
);

router.delete(
  "/",
  protect,
  deleteAbout
);

module.exports = router;