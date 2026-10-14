const Skill = require("../models/Skill");
const deleteCloudinaryImage = require("../utils/deleteCloudinaryImage");

const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, skills });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get skills" });
  }
};

const getSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ success: false, message: "Skill not found" });
    res.status(200).json({ success: true, skill });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get skill" });
  }
};

const createSkill = async (req, res) => {
  try {
    const skillData = {
      ...req.body,
      image: req.file ? req.file.path : "",
    };
    const skill = await Skill.create(skillData);
    res.status(201).json({ success: true, message: "Skill created successfully", skill });
  } catch (error) {
    console.error("Create Skill Error:", error);
    res.status(500).json({ success: false, message: "Failed to create skill", error: error.message });
  }
};

const updateSkill = async (req, res) => {
  try {
    const existingSkill = await Skill.findById(req.params.id);
    if (!existingSkill) return res.status(404).json({ success: false, message: "Skill not found" });

    const updateData = { ...req.body };

    if (req.file) {
      await deleteCloudinaryImage(existingSkill.image);
      updateData.image = req.file.path;
    }

    const skill = await Skill.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: "Skill updated successfully", skill });
  } catch (error) {
    console.error("Update Skill Error:", error);
    res.status(500).json({ success: false, message: "Failed to update skill", error: error.message });
  }
};

const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ success: false, message: "Skill not found" });
    await deleteCloudinaryImage(skill.image);
    res.status(200).json({ success: true, message: "Skill deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete skill" });
  }
};

module.exports = { getSkills, getSkill, createSkill, updateSkill, deleteSkill };
