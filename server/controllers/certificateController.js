
const Certificate = require("../models/Certificate");

// PUBLIC: Published certificates only

const getCertificates = async (req, res) => {
  try {
    const filter =
      req.query.public === "true"
        ? { status: "published" }
        : {};

    const certificates = await Certificate.find(filter).sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      certificates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch certificates",
    });
  }
};

// ADMIN: All certificates, including drafts
const getAllCertificatesAdmin = async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({
      order: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      certificates,
    });
  } catch (error) {
    console.error("Admin certificates error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch certificates",
    });
  }
};

// PUBLIC: Get one published certificate
const getCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({
      _id: req.params.id,
      status: "published",
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    return res.status(200).json({
      success: true,
      certificate,
    });
  } catch (error) {
    console.error("Get certificate error:", error);

    return res.status(400).json({
      success: false,
      message: "Invalid certificate ID",
    });
  }
};

// CREATE certificate
const createCertificate = async (req, res) => {
  try {
    const certificateData = {
      ...req.body,
    };

    if (!certificateData.issueDate) {
      certificateData.issueDate = null;
    }

    if (certificateData.order !== undefined) {
      certificateData.order = Number(certificateData.order);
    }

    if (req.file) {
      certificateData.image = `/uploads/${req.file.filename}`;
    }

    const certificate = await Certificate.create(
      certificateData
    );

    return res.status(201).json({
      success: true,
      message: "Certificate created successfully",
      certificate,
    });
  } catch (error) {
    console.error("Create certificate error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE certificate
const updateCertificate = async (req, res) => {
  try {
    const certificateData = {
      ...req.body,
    };

    if (!certificateData.issueDate) {
      certificateData.issueDate = null;
    }

    if (certificateData.order !== undefined) {
      certificateData.order = Number(certificateData.order);
    }

    // If no new image is uploaded, retain the existing image.
    if (req.file) {
      certificateData.image = `/uploads/${req.file.filename}`;
    } else {
      delete certificateData.image;
    }

    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      certificateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Certificate updated successfully",
      certificate,
    });
  } catch (error) {
    console.error("Update certificate error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE certificate
const deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndDelete(
      req.params.id
    );

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Certificate deleted successfully",
    });
  } catch (error) {
    console.error("Delete certificate error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete certificate",
    });
  }
};

module.exports = {
  getCertificates,
  getAllCertificatesAdmin,
  getCertificate,
  createCertificate,
  updateCertificate,
  deleteCertificate,
};