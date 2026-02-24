const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../config/utils');

// Signup
const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ message: 'Email and Password are Required' });
  }

  // Check if email already exists
  const emailExists = await User.findOne({ email: email });
  if (emailExists) {
    return res.status(409).json({ message: 'Account Exist' }); // Conflict
  }

  // Check if username already exists
  const userNameExists = await User.findOne({ username: username });
  if (userNameExists) {
    return res.status(409).json({ message: 'Username Unavailable' });
  }

  try {
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
      role: 'user',
    });

    generateAccessToken(newUser, res);
    const refreshToken = generateRefreshToken(newUser, res);

    // Store refresh token in database
    newUser.refreshToken = refreshToken;
    await newUser.save();

    // create a user data version excluded from password
    const userWithoutPassword = newUser.toObject();
    delete userWithoutPassword.password;

    res.status(201).json({
      message: 'User registered successfully',
      userData: userWithoutPassword,
    });
  } catch (error) {
    console.log('Error in signup controller:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and Password are Required' });
    }

    // Find user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: 'Incorrect Credentials' }); // Unauthorized
    }

    // Compare password
    const matchedPassword = await bcrypt.compare(password, user.password);
    if (matchedPassword) {
      generateAccessToken(user, res);
      const refreshToken = generateRefreshToken(user, res);

      // Update refresh token in database
      user.refreshToken = refreshToken;
      await user.save();

      // create a user data version excluded from password
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;

      res.status(200).json({
        message: 'User logged in successfully',
        userData: userWithoutPassword,
      });
    } else {
      res.status(401).json({ message: 'Incorrect Credentials' });
    }
  } catch (error) {
    console.log('Error in login controller:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Logout
const logout = async (req, res) => {
  const userId = req.userId;

  try {
    // Find the user with this refresh token
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(403).json({ message: 'User Not Found' });
    }

    // Remove tokens from cookies
    res.cookie('access_token', '', { maxAge: 0 });
    res.cookie('refresh_token', '', { maxAge: 0 });

    // Remove refresh token from the database
    user.refreshToken = null;
    await user.save();
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error in logout controller:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Refresh Token
const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken) {
    return res.status(400).json({
      message: 'Refresh token not found',
    });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_TOKEN);
    const userId = decoded.userId;
    const user = await User.findOne({ _id: userId }).select('-password');

    // Issue a new access token
    generateAccessToken(user, res);

    res.json({
      accessToken: newAccessToken,
      userData: user,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

const checkAuth = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Token is valid', userData: user });
  } catch (error) {
    console.log('Error in check authentication controller:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { signup, login, logout, refreshToken, checkAuth };
