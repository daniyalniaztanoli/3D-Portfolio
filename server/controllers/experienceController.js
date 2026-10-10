const Experience = require("../models/Experience");

// =========================
// GET all Experiences
// =========================

const getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find().sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      experiences,
    });
  } catch (error) {
    console.error(
      "Get Experiences Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to get experiences",
    });
  }
};

// =========================
// GET single Experience
// =========================

const getExperience = async (req, res) => {
  try {
    const experience =
      await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    res.status(200).json({
      success: true,
      experience,
    });
  } catch (error) {
    console.error(
      "Get Experience Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to get experience",
    });
  }
};

// =========================
// CREATE Experience
// =========================

const createExperience = async (req, res) => {
  try {
    const experienceData = {
      ...req.body,

      currentlyWorking:
        req.body.currentlyWorking === "true",

      companyLogo: req.file
        ? `/uploads/${req.file.filename}`
        : "",
    };

    const experience =
      await Experience.create(
        experienceData
      );

    res.status(201).json({
      success: true,
      message:
        "Experience created successfully",
      experience,
    });
  } catch (error) {
    console.error(
      "Create Experience Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to create experience",
      error: error.message,
    });
  }
};

// =========================
// UPDATE Experience
// =========================

const updateExperience = async (req, res) => {
  try {
    const existingExperience =
      await Experience.findById(
        req.params.id
      );

    if (!existingExperience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    const updateData = {
      ...req.body,

      currentlyWorking:
        req.body.currentlyWorking === "true",
    };

    // New company logo upload
    if (req.file) {
      updateData.companyLogo =
        `/uploads/${req.file.filename}`;
    }

    const experience =
      await Experience.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      success: true,
      message:
        "Experience updated successfully",
      experience,
    });
  } catch (error) {
    console.error(
      "Update Experience Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update experience",
      error: error.message,
    });
  }
};

// =========================
// DELETE Experience
// =========================

const deleteExperience = async (req, res) => {
  try {
    const experience =
      await Experience.findByIdAndDelete(
        req.params.id
      );

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Experience deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Experience Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete experience",
    });
  }
};

module.exports = {
  getExperiences,
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
};