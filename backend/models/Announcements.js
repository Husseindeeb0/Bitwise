const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  time: { type: Date, required: true },
  place: { type: String, required: true },
  imageUrl: { type: String, required: true }
});

const Announcement = mongoose.model("Announcement", announcementSchema);
module.exports = Announcement;
