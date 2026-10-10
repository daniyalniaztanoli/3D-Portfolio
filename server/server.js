const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const profileRoutes = require("./routes/profileRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const skillRoutes = require("./routes/skillRoutes");
const experienceRoutes = require("./routes/experienceRoutes");
const educationRoutes = require("./routes/educationRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const messageRoutes = require("./routes/messageRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const certificateRoutes = require("./routes/certificateRoutes");

dotenv.config();

const app = express();

// =========================
// Middleware
// =========================

app.use(
  cors({
    origin: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================
// Static Uploaded Files
// =========================

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// =========================
// Connect MongoDB
// =========================

connectDB();

// =========================
// API Routes
// =========================

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/educations", educationRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/certificates", certificateRoutes);

// =========================
// Health Check
// =========================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Portfolio API is running",
  });
});

// =========================
// 404 Handler
// =========================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// =========================
// Global Error Handler
// =========================

app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    success: false,
    message:
      err.message || "Internal server error",
  });
});

// =========================
// Start Server
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});