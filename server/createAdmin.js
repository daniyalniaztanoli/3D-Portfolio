const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

dotenv.config();

// Admin credentials
const ADMIN_NAME = "Daniyal";
const ADMIN_EMAIL = "dniaz0122@gmail.com";
const ADMIN_PASSWORD = "Daniyal64117###";

const updateAdmin = async () => {
try {
// Validate credentials
if (
!ADMIN_EMAIL.trim() ||
!ADMIN_PASSWORD ||
ADMIN_EMAIL === "[your-email@example.com](mailto:your-email@example.com)" ||
ADMIN_PASSWORD === "ReplaceWithANewStrongPassword"
) {
throw new Error(
"createAdmin.js mein apna email aur naya password set karo."
);
}

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI server .env file mein missing hai.");
}

// Connect to MongoDB
await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB connected successfully");

const email = ADMIN_EMAIL.trim().toLowerCase();

// Find admin by the intended email first
let admin = await User.findOne({ email });

// If not found, update the existing admin account
if (!admin) {
  admin = await User.findOne({ role: "admin" });
}

// Hash password before saving
const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

if (admin) {
  admin.name = ADMIN_NAME;
  admin.email = email;
  admin.password = hashedPassword;
  admin.role = "admin";

  await admin.save();

  console.log("Admin credentials updated successfully!");
} else {
  await User.create({
    name: ADMIN_NAME,
    email,
    password: hashedPassword,
    role: "admin",
  });

  console.log("Admin created successfully!");
}

console.log("Admin email:", email);
console.log("You can now test the admin login.");

} catch (error) {
console.error("Admin setup failed:", error.message);
} finally {
if (mongoose.connection.readyState !== 0) {
await mongoose.disconnect();
}
}
};

updateAdmin();
