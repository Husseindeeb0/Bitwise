const jwt = require("jsonwebtoken");

export const generateAccessToken = async (user, res) => {
  const accessSecret = process.env.ACCESS_SECRET_TOKEN;
  if (!accessSecret) {
    throw new Error(
      "ACCESS_SECRET_TOKEN is not defined in environment variables"
    );
  }

  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    accessSecret,
    {
      expiresIn: "1d",
    }
  );

  res.cookie("access_token", accessToken, {
    maxAge: 24 * 60 * 60 * 1000, // 1 days in milliseconds
    httpOnly: true, // Prevents XSS atatcks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "development",
  });

  return accessToken;
};

export const generateRefreshToken = async (user, res) => {
  const refreshSecret = process.env.REFRESH_SECRET_TOKEN;
  if (!refreshSecret) {
    throw new Error(
      "ACCESS_SECRET_TOKEN is not defined in environment variables"
    );
  }

  const refreshToken = jwt.sign(
    { userId: user._id, role: user.role },
    refreshSecret,
    {
      expiresIn: "7d",
    }
  );

  res.cookie("refreshToken", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });
};
