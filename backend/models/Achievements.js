const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  time: { type: Date, required: true },
  creator: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

const Achievement = mongoose.model("Achievement", achievementSchema);
module.exports = Achievement;
