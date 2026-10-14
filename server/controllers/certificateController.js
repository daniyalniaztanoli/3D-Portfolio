const Certificate = require("../models/Certificate");
const deleteCloudinaryImage = require("../utils/deleteCloudinaryImage");

const getCertificates = async (req, res) => {
  try {
    const filter = req.query.public === "true" ? { status: "published" } : {};
    const certificates = await Certificate.find(filter).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, certificates });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch certificates" });
  }
};

const getAllCertificatesAdmin = async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ order: 1, createdAt: -1 });
    return res.status(200).json({ success: true, certificates });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch certificates" });
  }
};

const getCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ _id: req.params.id, status: "published" });
    if (!certificate) return res.status(404).json({ success: false, message: "Certificate not found" });
    return res.status(200).json({ success: true, certificate });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Invalid certificate ID" });
  }
};

const createCertificate = async (req, res) => {
  try {
    const certificateData = { ...req.body };
    if (!certificateData.issueDate) certificateData.issueDate = null;
    if (certificateData.order !== undefined) certificateData.order = Number(certificateData.order);
    if (req.file) certificateData.image = req.file.path;

    const certificate = await Certificate.create(certificateData);
    return res.status(201).json({ success: true, message: "Certificate created successfully", certificate });
  } catch (error) {
    console.error("Create certificate error:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const updateCertificate = async (req, res) => {
  try {
    const existing = await Certificate.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: "Certificate not found" });

    const certificateData = { ...req.body };
    if (!certificateData.issueDate) certificateData.issueDate = null;
    if (certificateData.order !== undefined) certificateData.order = Number(certificateData.order);

    if (req.file) {
      await deleteCloudinaryImage(existing.image);
      certificateData.image = req.file.path;
    } else {
      delete certificateData.image;
    }

    const certificate = await Certificate.findByIdAndUpdate(req.params.id, certificateData, { new: true, runValidators: true });
    return res.status(200).json({ success: true, message: "Certificate updated successfully", certificate });
  } catch (error) {
    console.error("Update certificate error:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndDelete(req.params.id);
    if (!certificate) return res.status(404).json({ success: false, message: "Certificate not found" });
    await deleteCloudinaryImage(certificate.image);
    return res.status(200).json({ success: true, message: "Certificate deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete certificate" });
  }
};

module.exports = { getCertificates, getAllCertificatesAdmin, getCertificate, createCertificate, updateCertificate, deleteCertificate };
