const cloudinary = require("../config/cloudinary");

const deleteCloudinaryImage = async (imageUrl) => {
  if (!imageUrl || imageUrl.startsWith("/uploads/")) return;
  try {
    const parts = imageUrl.split("/");
    const filename = parts[parts.length - 1].split(".")[0];
    const folder = parts[parts.length - 2];
    const publicId = `${folder}/${filename}`;
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary delete error:", err.message);
  }
};

module.exports = deleteCloudinaryImage;
