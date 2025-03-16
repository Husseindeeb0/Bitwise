const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ status: "failed", message: "Email and Password are Required" });
  }

  // Check if email already exists
  const emailExists = await User.findOne({ email: email }).exec();
  if (emailExists) {
    return res.status(409).json({ status: "failed", message: "Email already exists" }); // Conflict
  }

  // Check if username already exists
  const userNameExists = await User.findOne({ username: username }).exec();
  if (userNameExists) {
    return res.status(409).json({ status: "failed", message: "Username already exists" });
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

module.exports = { register };
