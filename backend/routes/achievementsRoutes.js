const express = require('express');
const router = express.Router();
const {
  addAchievements,
  editAchievements,
  deleteAchievements,
  getAchievements,
  getAchievementById,
  getLatestAchievement,
} = require('../controllers/achievements.controller');
const { verifyJWT } = require('../middleware/verifyJWT');

router.post('/addAchievements', verifyJWT, addAchievements);
router.post('/editAchievements', verifyJWT, editAchievements);
router.delete('/deleteAchievements/:id', verifyJWT, deleteAchievements);
router.get('/getAchievements', getAchievements);
router.get('/getAchievementById/:id', getAchievementById);
router.get('/getLatestAchievement', getLatestAchievement);

module.exports = router;
