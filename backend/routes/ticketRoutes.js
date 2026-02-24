const express = require('express');
const router = express.Router();
const {
  generateTicketPDF,
  validateTicket,
} = require('../controllers/ticket.controller');
const { verifyJWT } = require('../middleware/verifyJWT');

router.get('/download/:announcementId', verifyJWT, generateTicketPDF);
router.post('/validate', verifyJWT, validateTicket);

module.exports = router;
