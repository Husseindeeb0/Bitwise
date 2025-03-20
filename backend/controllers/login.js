const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Login user
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ status: "failed", message: "Email and Password are Required" });
  }

  // Find user by email
  const user = await User.findOne({ email: email }).exec();
  if (!user) {
    return res.status(401).json({ status: "failed", message: "Incorrect Email" }); // Unauthorized
  }

  // Compare password
  const matchedPassword = await bcrypt.compare(password, user.password);
  if (matchedPassword) {
    // Generate accessToken
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.ACCESS_SECRET_TOKEN,
      { expiresIn: "1h" }
    );

    // Generate refreshToken
    const refreshToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.REFRESH_SECRET_TOKEN,
      { expiresIn: "7d" }
    );

    // Update refresh token in database
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      accessToken,
      refreshToken,
    });
  } else {
    res.status(401).json({ status: "failed", message: "Incorrect Password" });
  }
};

module.exports = { login };