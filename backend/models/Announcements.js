const mongoose = require("mongoose");

// Define a sub-schema for organizers
const organizerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    image: { type: String, required: true },
  },
  { _id: false }
); // This prevents creating _id for each organizer

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    mainImage: { type: String, required: true },
    organizers: {
      type: [organizerSchema],
      default: [],
    },
    active: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
); // Adds createdAt and updatedAt fields automatically

const Announcement = mongoose.model("Announcement", announcementSchema);
module.exports = Announcement;
