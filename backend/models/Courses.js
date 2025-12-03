const mongoose = require("mongoose");

const instructorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    bio: { type: String, required: true },
    imageUrl: { type: String, required: true },
    imageId: { type: String },
    coursesNum: { type: Number },
  },
  { _id: false }
);

const lectureSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true },
    duration: { type: String, required: true },
    lecture: { type: String, default: "" },
    isPreview: { type: Boolean, default: false },
  },
  { _id: false }
);

const sectionSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true },
    lectures: { type: [lectureSchema], required: true },
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String },
    type: { type: String, required: true, default: 'Course' },
    isPopular: { type: Boolean, default: false },
    isBestseller: { type: Boolean, default: false },
    instructor: { type: instructorSchema, required: true },

    price: { type: Number },
    originalPrice: { type: Number },
    posterUrl: { type: String, required: true },
    posterId: { type: String },
    description: { type: String, required: true },

    whatYouWillLearn: { type: [String], default: [], required: true },
    skillsGained: { type: [String], default: [], required: true },
    requirements: { type: [String], default: [] },

    hours: { type: Number, required: true },
    lecturesNum: { type: Number, required: true },
    // rating: { type: Number, required: true },
    difficulty: { type: String, required: true },
    studentsEnrolled: { type: Number },
    lastUpdated: { type: String, required: true },
    language: { type: String, required: true },

    sections: { type: [sectionSchema], required: true },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
