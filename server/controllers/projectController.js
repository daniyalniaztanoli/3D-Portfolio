const Project = require("../models/Project");

// =========================
// GET all projects
// =========================

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("Get Projects Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get projects",
    });
  }
};

// =========================
// GET single project
// =========================

const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("Get Project Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get project",
    });
  }
};

// =========================
// CREATE project
// =========================

const createProject = async (req, res) => {
  try {
    const projectData = {
      ...req.body,

      technologies: req.body.technologies
        ? JSON.parse(req.body.technologies)
        : [],

      image: req.file
        ? `/uploads/${req.file.filename}`
        : "",
    };

    const project = await Project.create(projectData);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("Create Project Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create project",
      error: error.message,
    });
  }
};

// =========================
// UPDATE project
// =========================

const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(
      req.params.id
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const updateData = {
      ...req.body,
    };

    // Technologies ko array mein convert karo
    if (req.body.technologies) {
      updateData.technologies = JSON.parse(
        req.body.technologies
      );
    }

    // Agar new image upload hui hai
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedProject =
      await Project.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Update Project Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update project",
      error: error.message,
    });
  }
};

// =========================
// DELETE project
// =========================

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(
      req.params.id
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete Project Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete project",
    });
  }
};

// =========================
// Export
// =========================

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};