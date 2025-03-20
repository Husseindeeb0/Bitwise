const User = require("../models/User");

const logout = async (req, res) => {
  const { refreshToken } = req.body;
  // const refreshToken = req.headers.authorization;

  if (!refreshToken) {
    return res.status(400).json({ status: "failed", message: "Refresh token is required" });
  }

  try {
    // Find the user with this refresh token
    const user = await User.findOne({ refreshToken }).exec();
    if (!user) {
      return res.status(403).json({ status: "failed", message: "Invalid refresh token" });
    }

    // Remove refresh token from the database
    user.refreshToken = null;
    await user.save();

    res.json({ status: "success", message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: `Internal server error: ${error}` });
  }
};

module.exports = { logout };
