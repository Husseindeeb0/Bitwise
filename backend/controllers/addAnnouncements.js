const Announcement = require("../models/Announcements");

const addAnnouncements = async (req, res) => {
  try {
    const { newAnnouncement } = req.body;

    const announcement = new Announcement(newAnnouncement);

    // Save to database
    const savedAnnouncement = await announcement.save();

    return res.status(201).json({
      state: "success",
      message: "Announcement added successfully",
    });

  } catch (error) {
    console.error("Error adding announcement:", error);
    return res.status(500).json({
      state: "failed",
      message: "Failed to add announcement",
    });
  }
};

module.exports = { addAnnouncements };