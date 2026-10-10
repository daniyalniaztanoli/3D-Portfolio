const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema(
  {
    institution: {
      type: String,
      required: true,
      trim: true,
    },

    degree: {
      type: String,
      required: true,
      trim: true,
    },

    field: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    startDate: {
      type: String,
      default: "",
    },

    endDate: {
      type: String,
      default: "",
    },

    currentlyStudying: {
      type: Boolean,
      default: false,
    },

    institutionLogo: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    grade: {
      type: String,
      default: "",
      trim: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Education",
  educationSchema
);