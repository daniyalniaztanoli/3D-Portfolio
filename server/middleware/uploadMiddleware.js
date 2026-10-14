const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const memUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const toCloudinary = (buffer, fieldname) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "portfolio",
        resource_type: fieldname === "resume" ? "raw" : "image",
      },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });

const afterUpload = async (req, res, next) => {
  try {
    if (req.file) {
      const result = await toCloudinary(req.file.buffer, req.file.fieldname);
      req.file.path = result.secure_url;
    }
    if (req.files) {
      for (const [fieldname, files] of Object.entries(req.files)) {
        for (const file of files) {
          const result = await toCloudinary(file.buffer, fieldname);
          file.path = result.secure_url;
        }
      }
    }
    next();
  } catch (err) {
    next(err);
  }
};

const upload = {
  single: (field) => [memUpload.single(field), afterUpload],
  fields: (fields) => [memUpload.fields(fields), afterUpload],
};

module.exports = upload;
