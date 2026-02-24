const express = require('express');
const router = express.Router();
const {
  createBookForm,
  updateBookForm,
  deleteBookForm,
} = require('../controllers/bookForm.controller');
const { verifyJWT } = require('../middleware/verifyJWT');

router.post('/create', verifyJWT, createBookForm);
router.patch('/update', verifyJWT, updateBookForm);
router.delete('/delete/:bookFormId', verifyJWT, deleteBookForm);

module.exports = router;
