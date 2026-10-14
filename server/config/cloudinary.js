const cloudinary = require("cloudinary").v2;

if (process.env.CLOUDINARY_URL) {
  // CLOUDINARY_URL auto-configures the SDK
  console.log("Cloudinary configured via CLOUDINARY_URL");
} else if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log("Cloudinary configured via individual env vars");
} else {
  console.error("WARNING: No Cloudinary credentials found!");
}

module.exports = cloudinary;
