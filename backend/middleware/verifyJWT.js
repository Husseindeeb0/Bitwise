const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const accessToken = req.cookies.access_token;

  if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(accessToken, process.env.ACCESS_SECRET_TOKEN, (error, decoded) => {
    if (error) {
      return res.status(403).json({ message: `Unauthorized: ${error}` });
    }

    req.userId = decoded.userId;
    next();
  });
};

module.exports = { verifyJWT };
