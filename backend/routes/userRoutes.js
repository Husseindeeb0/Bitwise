const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../middleware/verifyJWT');
const {
  changeUserRole,
  getAllUsers,
  getMe,
  updateUser,
} = require('../controllers/user.controller');

router.get('/me', verifyJWT, getMe);
router.get('/getAllUsers', verifyJWT, getAllUsers);
router.patch('/changeUserRole', verifyJWT, changeUserRole);
router.patch('/updateUser', verifyJWT, updateUser);

module.exports = router;
