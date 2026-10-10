
const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      default: "",
      trim: true,
    },

    bio: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    githubUrl: {
      type: String,
      default: "",
      trim: true,
    },

    linkedinUrl: {
      type: String,
      default: "",
      trim: true,
    },

    // Uploaded CV PDF URL
    resumeUrl: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Profile", profileSchema);