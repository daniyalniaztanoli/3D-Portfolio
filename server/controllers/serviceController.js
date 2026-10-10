const Service = require("../models/Service");

// GET all services
const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      services,
    });
  } catch (error) {
    console.error("Get Services Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get services",
    });
  }
};

// GET single service
const getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    console.error("Get Service Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get service",
    });
  }
};

// CREATE service
const createService = async (req, res) => {
  try {
    const features = req.body.features
      ? JSON.parse(req.body.features)
      : [];

    const serviceData = {
      ...req.body,
      features,
      image: req.file
        ? `/uploads/${req.file.filename}`
        : "",
    };

    const service = await Service.create(serviceData);

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    console.error("Create Service Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create service",
      error: error.message,
    });
  }
};

// UPDATE service
const updateService = async (req, res) => {
  try {
    const existingService = await Service.findById(
      req.params.id
    );

    if (!existingService) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const updateData = {
      ...req.body,
    };

    if (req.body.features) {
      updateData.features = JSON.parse(
        req.body.features
      );
    }

    if (req.file) {
      updateData.image =
        `/uploads/${req.file.filename}`;
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    console.error("Update Service Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update service",
    });
  }
};

// DELETE service
const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(
      req.params.id
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Delete Service Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete service",
    });
  }
};

module.exports = {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
};