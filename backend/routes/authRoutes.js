const express = require("express");
const router = express.Router();
const { verifyJWT } = require("../middleware/verifyJWT");
const { signup, login, logout, refreshToken, checkAuth } = require("../controllers/auth.controller");

// Define routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", verifyJWT, logout);
router.post("/refreshToken", refreshToken);
router.get('/verifyJWT', verifyJWT, checkAuth);

module.exports = router;
