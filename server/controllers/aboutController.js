const About = require("../models/About");

// =========================
// GET About
// =========================

const getAbout = async (req, res) => {
  try {
    const about = await About.findOne();

    res.status(200).json({
      success: true,
      about,
    });
  } catch (error) {
    console.error("Get About Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get about",
    });
  }
};

// =========================
// CREATE About
// =========================

const createAbout = async (req, res) => {
  try {
    const existingAbout = await About.findOne();

    if (existingAbout) {
      return res.status(400).json({
        success: false,
        message: "About already exists",
      });
    }

    const aboutData = {
      ...req.body,

      image: req.file
        ? `/uploads/${req.file.filename}`
        : "",
    };

    const about = await About.create(aboutData);

    res.status(201).json({
      success: true,
      message: "About created successfully",
      about,
    });
  } catch (error) {
    console.error("Create About Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create about",
      error: error.message,
    });
  }
};

// =========================
// UPDATE About
// =========================

const updateAbout = async (req, res) => {
  try {
    const existingAbout = await About.findOne();

    if (!existingAbout) {
      return res.status(404).json({
        success: false,
        message: "About not found",
      });
    }

    const updateData = {
      ...req.body,
    };

    // New image upload hui ho
    if (req.file) {
      updateData.image =
        `/uploads/${req.file.filename}`;
    }

    const about =
      await About.findByIdAndUpdate(
        existingAbout._id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      success: true,
      message: "About updated successfully",
      about,
    });
  } catch (error) {
    console.error("Update About Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update about",
      error: error.message,
    });
  }
};

// =========================
// DELETE About
// =========================

const deleteAbout = async (req, res) => {
  try {
    const about = await About.findOneAndDelete();

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "About not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "About deleted successfully",
    });
  } catch (error) {
    console.error("Delete About Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete about",
    });
  }
};

module.exports = {
  getAbout,
  createAbout,
  updateAbout,
  deleteAbout,
};