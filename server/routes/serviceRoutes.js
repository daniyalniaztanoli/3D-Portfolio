const express = require("express");

const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Public GET
router.get("/", getServices);
router.get("/:id", getService);

// Protected CRUD
router.post(
  "/",
  protect,
  upload.single("image"),
  createService
);

router.put(
  "/:id",
  protect,
  upload.single("image"),
  updateService
);

router.delete(
  "/:id",
  protect,
  deleteService
);

module.exports = router;