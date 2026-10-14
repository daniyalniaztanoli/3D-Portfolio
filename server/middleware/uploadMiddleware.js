const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const isImage = file.fieldname !== "resume";
    return {
      folder: "portfolio",
      resource_type: isImage ? "image" : "raw",
      allowed_formats: isImage
        ? ["jpg", "jpeg", "png", "webp"]
        : ["pdf"],
    };
  },
});

const fileFilter = (req, file, cb) => {
  const imageFields = ["profileImage", "image"];
  const imageTypes = ["image/jpeg", "image/png", "image/webp"];

  if (imageFields.includes(file.fieldname)) {
    return imageTypes.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Image must be JPG, PNG or WEBP."));
  }

  if (file.fieldname === "resume") {
    return file.mimetype === "application/pdf"
      ? cb(null, true)
      : cb(new Error("CV must be a PDF file."));
  }

  cb(new Error("Unsupported file field."));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 2 },
});

module.exports = upload;
