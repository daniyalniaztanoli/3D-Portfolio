const Project = require("../models/Project");
const deleteCloudinaryImage = require("../utils/deleteCloudinaryImage");

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get projects" });
  }
};

const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    res.status(200).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get project" });
  }
};

const createProject = async (req, res) => {
  try {
    const projectData = {
      ...req.body,
      technologies: req.body.technologies ? JSON.parse(req.body.technologies) : [],
      image: req.file ? req.file.path : "",
    };

    const project = await Project.create(projectData);
    res.status(201).json({ success: true, message: "Project created successfully", project });
  } catch (error) {
    console.error("Create Project Error:", error);
    res.status(500).json({ success: false, message: "Failed to create project", error: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    const updateData = { ...req.body };

    if (req.body.technologies) {
      updateData.technologies = JSON.parse(req.body.technologies);
    }

    if (req.file) {
      await deleteCloudinaryImage(project.image);
      updateData.image = req.file.path;
    }

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: "Project updated successfully", project: updatedProject });
  } catch (error) {
    console.error("Update Project Error:", error);
    res.status(500).json({ success: false, message: "Failed to update project", error: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    await deleteCloudinaryImage(project.image);
    res.status(200).json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete project" });
  }
};

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject };
