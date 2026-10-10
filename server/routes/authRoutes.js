const express = require("express");

const {
  loginAdmin,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", loginAdmin);

router.get("/me", protect, (req, res) => {
  res.json({
    success: true,
    message: "You are authorized",
    user: req.user,
  });
});

module.exports = router;