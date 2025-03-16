const jwt = require("jsonwebtoken");

// Refresh Token
const refreshToken = (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    req
      .status(400)
      .json({ status: "failed", message: "Refresh token not found" });
  }

  jwt.verify(refreshToken, process.env.REFRESH_SECRET_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        status: "failed",
        message: "Unauthorized: Refresh token is expired",
      });
    }

    // Issue a new access token
    const newAccessToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email, role: decoded.role },
      process.env.ACCESS_SECRET_TOKEN,
      { expiresIn: "1h" }
    );

    res.json({ status: "success", accessToken: newAccessToken });
  });
};

module.exports = { refreshToken };
