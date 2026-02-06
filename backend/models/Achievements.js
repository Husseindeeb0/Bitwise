const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
  },
  { _id: false }
);

const achievementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    time: { type: Date, required: true },
    instructors: {
      type: [instructorSchema],
      default: [],
    },
    imageUrl: { type: String, required: true },
    imageId: { type: String },
    category: { type: String, required: true },
    location: { type: String, required: true },
  },
  { timestamps: true }
);

const Achievement = mongoose.model('achievements', achievementSchema);
module.exports = Achievement;
