
const express = require("express");

const {
  getCertificates,
  getAllCertificatesAdmin,
  getCertificate,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} = require("../controllers/certificateController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// PUBLIC: Published certificates only
router.get("/", getCertificates);

// ADMIN: All certificates, including drafts
// Keep this route before "/:id".
router.get(
  "/admin/all",
  protect,
  getAllCertificatesAdmin
);

// PUBLIC: Single published certificate
router.get("/:id", getCertificate);

// ADMIN: Create certificate
router.post(
  "/",
  protect,
  upload.single("image"),
  createCertificate
);

// ADMIN: Update certificate
router.put(
  "/:id",
  protect,
  upload.single("image"),
  updateCertificate
);

// ADMIN: Delete certificate
router.delete(
  "/:id",
  protect,
  deleteCertificate
);

module.exports = router;