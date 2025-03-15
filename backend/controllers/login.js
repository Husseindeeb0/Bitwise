const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

// Login user
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password are Required" });
  }

  // Find user by email
  const user = await User.findOne({ email: email }).exec();
  if (!user) {
    return res.status(401).json({ message: "Incorrect Email" }); // Unauthorized
  }

  // Compare password
  const matchedPassword = await bcrypt.compare(password, user.password);
  if (matchedPassword) {
    // Generate accessToken
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Generate refreshToken
    const refreshToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.REFRESH_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      status: "success",
      accessToken,
      refreshToken,
    });
  } else {
    res.status(401).json({ message: "Incorrect Password" });
  }
};

module.exports = { login };