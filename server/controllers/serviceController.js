const Service = require("../models/Service");

const parseFeatures = (value) => {
  if (value === undefined) return undefined;
  if (Array.isArray(value)) return value.map((f) => String(f).trim()).filter(Boolean);
  if (typeof value !== "string") return [];
  const trimmed = value.trim();
  if (!trimmed) return [];
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parsed.map((f) => String(f).trim()).filter(Boolean);
  } catch {
    // plain string
  }
  return [trimmed];
};

const normalizeStatus = (s) => {
  if (s === "published") return "active";
  if (s === "draft") return "inactive";
  return s;
};

const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1, createdAt: -1 });
    return res.status(200).json({ success: true, services });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to get services" });
  }
};

const getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    return res.status(200).json({ success: true, service });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to get service" });
  }
};

const createService = async (req, res) => {
  try {
    const data = { ...req.body };
    const features = parseFeatures(req.body.features);
    if (features !== undefined) data.features = features;
    if (data.order !== undefined && data.order !== "") {
      data.order = Number(data.order);
      if (!Number.isFinite(data.order)) return res.status(400).json({ success: false, message: "Order must be a valid number" });
    }
    data.image = req.file ? req.file.path : data.image || "";
    if (data.status) data.status = normalizeStatus(data.status);
    const service = await Service.create(data);
    return res.status(201).json({ success: true, message: "Service created successfully", service });
  } catch (error) {
    console.error("Create Service Error:", error.message);
    return res.status(500).json({ success: false, message: error.message || "Failed to create service" });
  }
};

const updateService = async (req, res) => {
  try {
    const existing = await Service.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: "Service not found" });
    const data = { ...req.body };
    const features = parseFeatures(req.body.features);
    if (features !== undefined) data.features = features;
    if (data.order !== undefined) {
      data.order = data.order === "" ? 0 : Number(data.order);
      if (!Number.isFinite(data.order)) return res.status(400).json({ success: false, message: "Order must be a valid number" });
    }
    delete data.image;
    if (req.file) data.image = req.file.path;
    if (data.status) data.status = normalizeStatus(data.status);
    const service = await Service.findByIdAndUpdate(req.params.id, { $set: data }, { new: true, runValidators: true });
    return res.status(200).json({ success: true, message: "Service updated successfully", service });
  } catch (error) {
    console.error("Update Service Error:", error.message);
    return res.status(400).json({ success: false, message: error.message || "Failed to update service" });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    return res.status(200).json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete service" });
  }
};

module.exports = { getServices, getService, createService, updateService, deleteService };
