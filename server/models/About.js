const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    yearsOfExperience: {
      type: Number,
      default: 0,
    },

    projectsCompleted: {
      type: Number,
      default: 0,
    },

    clients: {
      type: Number,
      default: 0,
    },

    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("About", aboutSchema);