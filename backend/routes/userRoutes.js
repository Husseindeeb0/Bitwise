const express = require("express");
const router = express.Router();
const { verifyJWT } = require("../middleware/verifyJWT");
const { changeUserRole, getAllUsers } = require("../controllers/userRole.controller");

router.get("/getAllUsers", verifyJWT, getAllUsers);
router.patch("/changeUserRole", verifyJWT, changeUserRole);

module.exports = router;