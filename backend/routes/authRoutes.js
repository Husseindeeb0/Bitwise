const express = require("express");
const router = express.Router();
const { verifyJWT } = require("../middleware/verifyJWT");
const { getUserRole } = require("../controllers/userRole.controller");
const { signup, login, logout, refreshToken } = require("../controllers/auth.controller");

// Define routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", verifyJWT, logout);
router.post("/refreshToken", refreshToken);
router.get("/getUserRole", verifyJWT, getUserRole);
router.get('/verifyJWT', verifyJWT, (req, res) => {
  res.status(200).json({ message: "Token is valid" });
});

module.exports = router;
