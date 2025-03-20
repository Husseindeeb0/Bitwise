const express = require("express");
const router = express.Router();
const { signup } = require("../controllers/signup");
const { login } = require("../controllers/login");
const { logout } = require("../controllers/logout");
const { verifyJWT } = require("../middleware/verifyJWT");
const { refreshToken } = require("../controllers/refreshToken");

// Define routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refreshToken", refreshToken);
router.get('/verifyJWT', verifyJWT, (req, res) => {
  res.status(200).json({ message: "Token is valid" });
});

module.exports = router;
