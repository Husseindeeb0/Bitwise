const Course = require('../models/Courses');
const { v4: uuidv4 } = require('uuid');
const imagekit = require('../config/imageKit');

// Add courses
const addCourse = async (req, res) => {
  try {
    const { newCourse } = req.body;
    const poster = newCourse.poster;
    let newImageUrl;
    let newImageId;
    if (newCourse.instructors && newCourse.instructors.length > 0) {
      for (let i = 0; i < newCourse.instructors.length; i++) {
        const instructor = newCourse.instructors[i];
        if (instructor.imageUrl) {
          const fileName = `image_${uuidv4()}`;
          const uploadResponse = await imagekit.upload({
            file: instructor.imageUrl,
            fileName,
            useUniqueFileName: true,
          });

          instructor.imageUrl = uploadResponse.url;
          instructor.imageId = uploadResponse.fileId;
        }
      }
    }

    if (poster) {
      const fileName = `image_${uuidv4()}`;

      const uploadResponse = await imagekit.upload({
        file: poster,
        fileName,
        useUniqueFileName: true,
      });

      newPosterUrl = uploadResponse.url;
      newPosterId = uploadResponse.fileId;
      newCourse.posterUrl = newImageUrl;
      newCourse.posterId = newImageId;
    }

    const course = new Course(newCourse);

    // Save to database
    await course.save();

    return res.status(201).json({
      message: 'Course added successfully',
    });
  } catch (error) {
    console.error('Error adding course:', error);
    return res.status(500).json({
      message: 'Failed to add course',
    });
  }
};

// Edit courses
const editCourse = async (req, res) => {
  try {
    const { updatedCourse } = req.body;
    const posterUrl = updatedCourse.posterUrl;
    const courseId = updatedCourse._id || updatedCourse.id;

    if (!courseId) {
      return res.status(400).json({
        message: 'Course ID is required',
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: 'Course not found',
      });
    }

    if (updatedCourse.instructors && updatedCourse.instructors.length > 0) {
      for (let i = 0; i < updatedCourse.instructors.length; i++) {
        const instructor = updatedCourse.instructors[i];
        const imageUrl = instructor.imageUrl;

        // Check if it's a new base64 image string
        if (
          imageUrl &&
          typeof imageUrl === 'string' &&
          !imageUrl.startsWith('http')
        ) {
          const fileName = `image_${uuidv4()}`;
          const uploadResponse = await imagekit.upload({
            file: imageUrl,
            fileName,
            useUniqueFileName: true,
          });

          instructor.imageUrl = uploadResponse.url;
          instructor.imageId = uploadResponse.fileId;
        }
      }
    }

    if (
      typeof posterUrl === 'string' &&
      !posterUrl.startsWith('http') &&
      posterUrl !== course.posterUrl
    ) {
      const oldPosterId = course.posterId;

      try {
        if (oldPosterId) {
          await imagekit.deleteFile(oldPosterId);
        }
      } catch (error) {
        console.log(`Failed to delete file ${oldPosterId}: `, error.message);
      }

      const fileName = `image_${uuidv4()}`;

      const uploadResponse = await imagekit.upload({
        file: posterUrl,
        fileName,
        useUniqueFileName: true,
      });

      const updatedPosterUrl = uploadResponse.url;
      const updatedPosterId = uploadResponse.fileId;
      updatedCourse.posterUrl = updatedPosterUrl;
      updatedCourse.posterId = updatedPosterId;
    }

    await Course.findByIdAndUpdate(
      courseId,
      { $set: updatedCourse },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: 'Course updated successfully',
    });
  } catch (error) {
    console.error('Error updating course:', error);
    return res.status(500).json({
      message: 'Failed to update course',
    });
  }
};

// Delete courses
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: 'Course ID is required',
      });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        message: 'Course not found',
      });
    }

    // Delete the images
    if (course.instructors && course.instructors.length > 0) {
      for (const instructor of course.instructors) {
        if (instructor.imageId) {
          try {
            await imagekit.deleteFile(instructor.imageId);
          } catch (error) {
            console.log(
              `Failed to delete file ${instructor.imageId}: `,
              error.message
            );
          }
        }
      }
    }

    if (course.posterId) {
      const oldPosterId = course.posterId;
      await imagekit.deleteFile(oldPosterId);
    }

    // Delete the course
    await Course.findByIdAndDelete(id);

    return res.status(200).json({
      message: 'Course deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    return res.status(500).json({
      message: 'Failed to delete course',
    });
  }
};

// Get courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: 1 });

    res.status(200).json({
      message: 'Courses returned successfully',
      coursesData: courses,
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      message: 'Failed to fetch courses',
    });
  }
};

module.exports = { addCourse, editCourse, deleteCourse, getCourses };
