const Profile = require("../models/Profile");
const deleteCloudinaryImage = require("../utils/deleteCloudinaryImage");

const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    return res.status(200).json({ success: true, profile });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to get profile" });
  }
};

const createProfile = async (req, res) => {
  try {
    const existingProfile = await Profile.findOne();
    if (existingProfile) {
      return res.status(400).json({ success: false, message: "Profile already exists" });
    }

    const files = req.files || {};
    const profileImage = files.profileImage?.[0];
    const resume = files.resume?.[0];

    const profileData = {
      ...req.body,
      profileImage: profileImage ? profileImage.path : "",
      resumeUrl: resume ? resume.path : req.body.resumeUrl || "",
    };

    const profile = await Profile.create(profileData);
    return res.status(201).json({ success: true, message: "Profile created successfully", profile });
  } catch (error) {
    console.error("Create Profile Error:", error);
    return res.status(500).json({ success: false, message: "Failed to create profile", error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const existingProfile = await Profile.findOne();
    if (!existingProfile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    const files = req.files || {};
    const profileImage = files.profileImage?.[0];
    const resume = files.resume?.[0];

    const updateData = { ...req.body };

    if (profileImage) {
      await deleteCloudinaryImage(existingProfile.profileImage);
      updateData.profileImage = profileImage.path;
    }

    if (resume) {
      await deleteCloudinaryImage(existingProfile.resumeUrl);
      updateData.resumeUrl = resume.path;
    }

    const profile = await Profile.findByIdAndUpdate(existingProfile._id, updateData, { new: true, runValidators: true });
    return res.status(200).json({ success: true, message: "Profile updated successfully", profile });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ success: false, message: "Failed to update profile", error: error.message });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndDelete();
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }
    await deleteCloudinaryImage(profile.profileImage);
    await deleteCloudinaryImage(profile.resumeUrl);
    return res.status(200).json({ success: true, message: "Profile deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete profile" });
  }
};

module.exports = { getProfile, createProfile, updateProfile, deleteProfile };
