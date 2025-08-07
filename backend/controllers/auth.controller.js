const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Signup
const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!email || !password || !username) {
    return res
      .status(400)
      .json({ status: "failed", message: "Email and Password are Required" });
  }

  // Check if email already exists
  const emailExists = await User.findOne({ email: email }).exec();
  if (emailExists) {
    return res
      .status(409)
      .json({ status: "failed", message: "Email already exists" }); // Conflict
  }

  // Check if username already exists
  const userNameExists = await User.findOne({ username: username }).exec();
  if (userNameExists) {
    return res
      .status(409)
      .json({ status: "failed", message: "Username already exists" });
  }

  try {
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
      role: "user",
    });

    // Generate accessToken
    const accessToken = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      process.env.ACCESS_SECRET_TOKEN,
      { expiresIn: "1h" }
    );

    // Generate refreshToken
    const refreshToken = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      process.env.REFRESH_SECRET_TOKEN,
      { expiresIn: "7d" }
    );

    // Store refresh token in database
    newUser.refreshToken = refreshToken;
    await newUser.save();

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "failed", message: `Internal server error: ${error}` });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ status: "failed", message: "Email and Password are Required" });
  }

  // Find user by email
  const user = await User.findOne({ email: email }).exec();
  if (!user) {
    return res
      .status(401)
      .json({ status: "failed", message: "Incorrect Email" }); // Unauthorized
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

// Logout
const logout = async (req, res) => {
  const userId = req.userId;

  try {
    // Find the user with this refresh token
    const user = await User.findOne({ _id: userId }).exec();
    if (!user) {
      return res
        .status(403)
        .json({ status: "failed", message: "User Not Found" });
    }

    // Remove refresh token from the database
    user.refreshToken = null;
    await user.save();
    res.json({ status: "success", message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "failed", message: `Internal server error: ${error}` });
  }
};

// Refresh Token
const refreshToken = (req, res) => {
  const refreshToken = req.headers.authorization.split(" ")[1];

  if (!refreshToken) {
    return res.status(400).json({
      status: "failed",
      message: "Refresh token not found",
    });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_TOKEN);

    // Issue a new access token
    const newAccessToken = jwt.sign(
      {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      },
      process.env.ACCESS_SECRET_TOKEN,
      { expiresIn: "1h" }
    );

    res.json({
      status: "success",
      accessToken: newAccessToken,
    });
  } catch (err) {
    // More specific error handling
    return res.status(403).json({
      status: "failed",
      message: "Unauthorized: Invalid or expired refresh token",
    });
  }
};

module.exports = { signup, login, logout, refreshToken };
