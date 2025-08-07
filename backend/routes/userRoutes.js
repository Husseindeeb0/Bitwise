const express = require("express");
const router = express.Router();
const { getAllUsers } = require('../controllers/userRole.controller');
const { verifyJWT } = require("../middleware/verifyJWT");
const { changeUserRole } = require("../controllers/userRole.controller");

router.get("/getAllUsers", verifyJWT, getAllUsers);
router.patch("/changeUserRole", verifyJWT, changeUserRole);

module.exports = router;