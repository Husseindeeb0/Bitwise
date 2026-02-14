const express = require('express');
const router = express.Router();

const {
  submitBookSubmission,
  deleteBookSubmission,
  getBookSubmissions,
} = require('../controllers/bookSub.controller');
const { verifyJWT } = require('../middleware/verifyJWT');

router.post('/submit', verifyJWT, submitBookSubmission);
router.delete('/delete/:bookSubmissionId', verifyJWT, deleteBookSubmission);
router.get('/getSubmissions/:announcementId', verifyJWT, getBookSubmissions);

module.exports = router;
