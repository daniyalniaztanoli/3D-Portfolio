
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDirectory = path.join(__dirname, "..", "uploads");

// Create uploads folder if it doesn't exist
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      extension;

    cb(null, uniqueName);
  },
});

const imageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();

  // Profile image validation
  if (file.fieldname === "profileImage") {
    if (
      imageTypes.includes(file.mimetype) &&
      [".jpg", ".jpeg", ".png", ".webp"].includes(extension)
    ) {
      return cb(null, true);
    }

    return cb(
      new Error("Profile image must be JPG, JPEG, PNG or WEBP.")
    );
  }

  // CV PDF validation
  if (file.fieldname === "resume") {
    if (
      file.mimetype === "application/pdf" &&
      extension === ".pdf"
    ) {
      return cb(null, true);
    }

    return cb(new Error("CV must be uploaded as a PDF file."));
  }

  return cb(new Error("Unsupported file field."));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 2,
  },
});

module.exports = upload;