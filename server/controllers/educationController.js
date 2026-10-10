const Education = require("../models/Education");

// =========================
// GET all Education
// =========================

const getEducations = async (req, res) => {
  try {
    const educations = await Education.find().sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      educations,
    });
  } catch (error) {
    console.error(
      "Get Educations Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to get education",
    });
  }
};

// =========================
// GET single Education
// =========================

const getEducation = async (req, res) => {
  try {
    const education =
      await Education.findById(req.params.id);

    if (!education) {
      return res.status(404).json({
        success: false,
        message: "Education not found",
      });
    }

    res.status(200).json({
      success: true,
      education,
    });
  } catch (error) {
    console.error(
      "Get Education Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to get education",
    });
  }
};

// =========================
// CREATE Education
// =========================

const createEducation = async (req, res) => {
  try {
    const educationData = {
      ...req.body,

      currentlyStudying:
        req.body.currentlyStudying === "true",

      institutionLogo: req.file
        ? `/uploads/${req.file.filename}`
        : "",
    };

    const education =
      await Education.create(
        educationData
      );

    res.status(201).json({
      success: true,
      message:
        "Education created successfully",
      education,
    });
  } catch (error) {
    console.error(
      "Create Education Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to create education",
      error: error.message,
    });
  }
};

// =========================
// UPDATE Education
// =========================

const updateEducation = async (req, res) => {
  try {
    const existingEducation =
      await Education.findById(
        req.params.id
      );

    if (!existingEducation) {
      return res.status(404).json({
        success: false,
        message: "Education not found",
      });
    }

    const updateData = {
      ...req.body,

      currentlyStudying:
        req.body.currentlyStudying === "true",
    };

    // New institution logo
    if (req.file) {
      updateData.institutionLogo =
        `/uploads/${req.file.filename}`;
    }

    const education =
      await Education.findByIdAndUpdate(
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
        "Education updated successfully",
      education,
    });
  } catch (error) {
    console.error(
      "Update Education Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update education",
    });
  }
};

// =========================
// DELETE Education
// =========================

const deleteEducation = async (req, res) => {
  try {
    const education =
      await Education.findByIdAndDelete(
        req.params.id
      );

    if (!education) {
      return res.status(404).json({
        success: false,
        message: "Education not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Education deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Education Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete education",
    });
  }
};

module.exports = {
  getEducations,
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
};