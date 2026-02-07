const express = require('express');
const router = express.Router();
const {
  addCourse,
  editCourse,
  deleteCourse,
  getCourses,
  getCourseById,
} = require('../controllers/courses.controller');
const { verifyJWT } = require('../middleware/verifyJWT');

router.post('/addCourse', verifyJWT, addCourse);
router.patch('/editCourse', verifyJWT, editCourse);
router.delete('/deleteCourse/:id', verifyJWT, deleteCourse);
router.get('/getCourses', getCourses);
router.get('/getCourseById/:id', getCourseById);

module.exports = router;
