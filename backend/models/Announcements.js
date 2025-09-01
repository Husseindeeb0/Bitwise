const mongoose = require("mongoose");
// Define a sub-schema for organizers
const organizerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    expertise: { type: String, required: true },
    imageUrl: { type: String, required: true },
    imageId: { type : String },
    description: { type: String, required: true },
    instaLink: { type: String, required: false },
    linkedinLink: { type: String, required: false },
    title: { type: String, required: true },
    startTime: { type: String, required: true },
  },
  { _id: false }
); // This prevents creating _id for each organizer

// Define a sub-schema for schedule items
const scheduleItemSchema = new mongoose.Schema(
  {
    startTime: { type: String, required: true },
    endTime: { type: String, required: false },
    date: { type: Date, required: false },
    title: { type: String, required: true },
    presenter: { type: String, required: false },
    type: { type: String, required: true, enum: ["session", "break", "opening", "closing"] }, // To differentiate between sessions and breaks
  },
  { _id: false }
);

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    mainImageUrl: { type: String, required: true },
    mainImageId: { type : String },
    organizers: {
      type: [organizerSchema],
      default: [],
    },
    schedule: {
      type: [scheduleItemSchema],
      default: [],
    },
    active: { type: Boolean, required: true, default: false },
    hasRegistration: { type: Boolean, default: false },
    registrationUrl: { type: String, default: "" },
  },
  { timestamps: true }
); // Adds createdAt and updatedAt fields automatically

const Announcement = mongoose.model("Announcement", announcementSchema);
module.exports = Announcement;
