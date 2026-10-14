const Service = require("../models/Service");

// Convert features into a valid array
const parseFeatures = (value) => {
  if (value === undefined) return undefined;

  // FormData multiple append -> array
  if (Array.isArray(value)) {
    return value.map((f) => String(f).trim()).filter(Boolean);
  }

  if (typeof value !== "string") return [];

  const trimmed = value.trim();
  if (!trimmed) return [];

  // Try JSON parse first
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed.map((f) => String(f).trim()).filter(Boolean);
    }
  } catch {
    // Not JSON — treat as plain string (single feature)
  }

  return [trimmed].filter(Boolean);
};

// GET all services
const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({
      order: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      services,
    });
  } catch (error) {
    console.error("Get Services Error:", error);

    return res.status(500).json({
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

    return res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    console.error("Get Service Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get service",
    });
  }
};

// CREATE service
const createService = async (req, res) => {
  try {
    const serviceData = { ...req.body };

    const features = parseFeatures(req.body.features);

    if (features !== undefined) {
      serviceData.features = features;
    }

    if (serviceData.order !== undefined && serviceData.order !== "") {
      serviceData.order = Number(serviceData.order);

      if (!Number.isFinite(serviceData.order)) {
        return res.status(400).json({
          success: false,
          message: "Order must be a valid number",
        });
      }
    }

    serviceData.image = req.file
      ? req.file.path
      : serviceData.image || "";

    const service = await Service.create(serviceData);

    return res.status(201).json({
      success: true,
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    console.error("Create Service Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create service",
    });
  }
};

// UPDATE service
const updateService = async (req, res) => {
  try {
    const existingService = await Service.findById(req.params.id);

    if (!existingService) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const updateData = { ...req.body };

    // Handle features only when provided
    const features = parseFeatures(req.body.features);

    if (features !== undefined) {
      updateData.features = features;
    }

    // Convert order from FormData string to number
    if (updateData.order !== undefined) {
      if (updateData.order === "") {
        updateData.order = 0;
      } else {
        updateData.order = Number(updateData.order);

        if (!Number.isFinite(updateData.order)) {
          return res.status(400).json({
            success: false,
            message: "Order must be a valid number",
          });
        }
      }
    }

    // Keep the existing image unless a new one is uploaded
    delete updateData.image;

    if (req.file) {
      updateData.image = req.file.path;
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    console.error("Update Service Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update service",
    });
  }
};

// DELETE service
const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Delete Service Error:", error);

    return res.status(500).json({
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