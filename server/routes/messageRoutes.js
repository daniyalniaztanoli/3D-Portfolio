const express = require("express");

const {
  getMessages,
  getMessage,
  createMessage,
  updateMessageStatus,
  deleteMessage,
} = require("../controllers/messageController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Public — contact form
router.post("/", createMessage);

// Protected — admin
router.get("/", protect, getMessages);

router.get("/:id", protect, getMessage);

router.patch(
  "/:id/status",
  protect,
  updateMessageStatus
);

router.delete(
  "/:id",
  protect,
  deleteMessage
);

module.exports = router;