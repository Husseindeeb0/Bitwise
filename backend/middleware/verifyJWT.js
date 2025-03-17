const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ status: "failed", message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token from the header

  jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (error, decoded) => {
    if (error) {
      return res.status(403).json({ status: "failed", message: `Unauthorized: ${error}` });
    }

    req.userId = decoded.userId;
    next();
  });
};

module.exports = { verifyJWT };
