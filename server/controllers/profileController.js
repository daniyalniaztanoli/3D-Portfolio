
const Profile = require("../models/Profile");

// =========================
// GET Profile
// =========================

const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne();

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get profile",
    });
  }
};

// =========================
// CREATE Profile
// =========================

const createProfile = async (req, res) => {
  try {
    const existingProfile = await Profile.findOne();

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists",
      });
    }

    const files = req.files || {};

    const profileImage = files.profileImage?.[0];
    const resume = files.resume?.[0];

    const profileData = {
      ...req.body,

      profileImage: profileImage
        ? `/uploads/${profileImage.filename}`
        : "",

      resumeUrl: resume
        ? `/uploads/${resume.filename}`
        : req.body.resumeUrl || "",
    };

    const profile = await Profile.create(profileData);

    return res.status(201).json({
      success: true,
      message: "Profile created successfully",
      profile,
    });
  } catch (error) {
    console.error("Create Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create profile",
      error: error.message,
    });
  }
};

// =========================
// UPDATE Profile
// =========================

const updateProfile = async (req, res) => {
  try {
    const existingProfile = await Profile.findOne();

    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    const files = req.files || {};

    const profileImage = files.profileImage?.[0];
    const resume = files.resume?.[0];

    const updateData = {
      ...req.body,
    };

    // Update profile image only if a new image is uploaded
    if (profileImage) {
      updateData.profileImage = `/uploads/${profileImage.filename}`;
    }

    // Update CV only if a new PDF is uploaded
    if (resume) {
      updateData.resumeUrl = `/uploads/${resume.filename}`;
    }

    const profile = await Profile.findByIdAndUpdate(
      existingProfile._id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

// =========================
// DELETE Profile
// =========================

const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndDelete();

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (error) {
    console.error("Delete Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete profile",
    });
  }
};

module.exports = {
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
};