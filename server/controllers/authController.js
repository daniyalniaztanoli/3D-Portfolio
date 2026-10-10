const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginAdmin = async (req, res) => {
try {
const { email, password } = req.body;

if (
  typeof email !== "string" ||
  typeof password !== "string" ||
  !email.trim() ||
  !password
) {
  return res.status(400).json({
    success: false,
    message: "Email and password are required",
  });
}

// Email ke extra spaces remove karo aur lowercase mein convert karo
const normalizedEmail = email.trim().toLowerCase();

const user = await User.findOne({ email: normalizedEmail });

if (!user) {
  return res.status(401).json({
    success: false,
    message: "Invalid email or password",
  });
}

const isPasswordCorrect = await bcrypt.compare(
  password,
  user.password
);

if (!isPasswordCorrect) {
  return res.status(401).json({
    success: false,
    message: "Invalid email or password",
  });
}

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing in server .env");
  return res.status(500).json({
    success: false,
    message: "Server configuration error",
  });
}

const token = jwt.sign(
  {
    id: user._id,
    role: user.role,
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

return res.status(200).json({
  success: true,
  message: "Login successful",
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
});


} catch (error) {
console.error("Login Error:", error.message);

return res.status(500).json({
  success: false,
  message: "Server error",
});


}
};

module.exports = { loginAdmin };
