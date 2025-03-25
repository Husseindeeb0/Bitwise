const jwt = require("jsonwebtoken");

// Refresh Token
const refreshToken = (req, res) => {
  const refreshToken = req.headers.authorization.split(' ')[1];

  if (!refreshToken) {
    return res.status(400).json({ 
      status: "failed", 
      message: "Refresh token not found" 
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
        role: decoded.role 
      },
      process.env.ACCESS_SECRET_TOKEN,
      { expiresIn: "1h" }
    );

    res.json({ 
      status: "success", 
      accessToken: newAccessToken 
    });
  } catch (err) {
    // More specific error handling
    return res.status(403).json({
      status: "failed",
      message: "Unauthorized: Invalid or expired refresh token"
    });
  }
};

module.exports = { refreshToken };