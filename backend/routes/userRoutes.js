const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../middleware/verifyJWT');
const {
  changeUserRole,
  getAllUsers,
  getMe,
} = require('../controllers/user.controller');

router.get('/me', verifyJWT, getMe);
router.get('/getAllUsers', verifyJWT, getAllUsers);
router.patch('/changeUserRole', verifyJWT, changeUserRole);

module.exports = router;
