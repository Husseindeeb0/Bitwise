const User = require("../models/User");

const logout = async (req, res) => {
  const userId = req.userId;

  try {
    // Find the user with this refresh token
    const user = await User.findOne({ _id: userId }).exec();
    if (!user) {
      return res.status(403).json({ status: "failed", message: "User Not Found" });
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
