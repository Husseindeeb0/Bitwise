const express = require("express");
const router = express.Router();
const { getAllUsers } = require('../controllers/getAllUsers');
const { verifyJWT } = require("../middleware/verifyJWT");
const { changeUserRole } = require("../controllers/changeUserRole");

router.get("/getAllUsers", verifyJWT, getAllUsers);
router.patch("/changeUserRole", verifyJWT, changeUserRole);

module.exports = router;