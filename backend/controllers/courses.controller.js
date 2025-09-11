const Course = require("../models/Courses");
const { v4: uuidv4 } = require("uuid");
const imagekit = require("../config/imageKit");

// Add courses
const addCourse = async (req, res) => {
  try {
    const { newCourse } = req.body;
    const poster = newCourse.poster;
    let newImageUrl;
    let newImageId;
    if (newCourse.instructor) {
      const fileName = `image_${uuidv4()}`;
      const uploadResponse = await imagekit.upload({
        file: newCourse.instructor.imageUrl,
        fileName,
        useUniqueFileName: true,
      });

      newImageUrl = uploadResponse.url;
      newImageId = uploadResponse.fileId;
      newCourse.instructor.imageUrl = newImageUrl;
      newCourse.instructor.imageId = newImageId;
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
      message: "Course added successfully",
    });
  } catch (error) {
    console.error("Error adding course:", error);
    return res.status(500).json({
      message: "Failed to add course",
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
        message: "Course ID is required",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    if (updatedCourse.instructor) {
      const imageUrl = updatedCourse.instructor.imageUrl;
      if (
        imageUrl &&
        typeof imageUrl === "string" &&
        !imageUrl.startsWith("http") &&
        imageUrl !== course.instructor.imageUrl
      ) {
        const oldId = course.instructor?.imageId;

        try {
          if (oldId) {
            await imagekit.deleteFile(oldId);
          }
        } catch (error) {
          console.log(`Failed to delete file ${oldId}: `, error.message);
        }

        const fileName = `image_${uuidv4()}`;
        const uploadResponse = await imagekit.upload({
          file: updatedCourse.instructor.imageUrl,
          fileName,
          useUniqueFileName: true,
        });

        const updatedImageUrl = uploadResponse.url;
        const updatedImageId = uploadResponse.fileId;
        updatedCourse.instructor.imageUrl = updatedImageUrl;
        updatedCourse.instructor.imageId = updatedImageId;
      }
    }

    if (
      typeof posterUrl === "string" &&
      !posterUrl.startsWith("http") &&
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
      message: "Course updated successfully",
    });
  } catch (error) {
    console.error("Error updating course:", error);
    return res.status(500).json({
      message: "Failed to update course",
    });
  }
};

// Delete courses
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Course ID is required",
      });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Delete the images
    if (course.instructor.imageId && course.posterId) {
      const oldId = course.instructor.imageId;
      await imagekit.deleteFile(oldId);

      const oldPosterId = course.posterId;
      await imagekit.deleteFile(oldPosterId);
    }

    // Delete the course
    await Course.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    return res.status(500).json({
      message: "Failed to delete course",
    });
  }
};

// Get courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: 1 });

    res.status(200).json({
      message: "Courses returned successfully",
      coursesData: courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({
      message: "Failed to fetch courses",
    });
  }
};

module.exports = { addCourse, editCourse, deleteCourse, getCourses };
