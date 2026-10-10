const Message = require("../models/Message");

// GET all messages
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Get Messages Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get messages",
    });
  }
};

// GET single message
const getMessage = async (req, res) => {
  try {
    const message = await Message.findById(
      req.params.id
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Get Message Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get message",
    });
  }
};

// CREATE message
const createMessage = async (req, res) => {
  try {
    const {
      name,
      email,
      subject,
      message,
    } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and message are required",
      });
    }

    const newMessage = await Message.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error(
      "Create Message Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};

// MARK AS READ / UNREAD
const updateMessageStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    if (!["read", "unread"].includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Status must be read or unread",
      });
    }

    const message =
      await Message.findByIdAndUpdate(
        req.params.id,
        { status },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Message status updated successfully",
      data: message,
    });
  } catch (error) {
    console.error(
      "Update Message Status Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update message status",
    });
  }
};

// DELETE message
const deleteMessage = async (req, res) => {
  try {
    const message =
      await Message.findByIdAndDelete(
        req.params.id
      );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Message deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Message Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete message",
    });
  }
};

module.exports = {
  getMessages,
  getMessage,
  createMessage,
  updateMessageStatus,
  deleteMessage,
};