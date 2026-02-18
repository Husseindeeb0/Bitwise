const express = require('express');
const router = express.Router();
const { generateTicketPDF } = require('../controllers/ticket.controller');
const { verifyJWT } = require('../middleware/verifyJWT');

router.get('/download/:announcementId', verifyJWT, generateTicketPDF);

module.exports = router;
