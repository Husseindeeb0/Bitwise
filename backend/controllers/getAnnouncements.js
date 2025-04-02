const Announcement = require("../models/Announcements");

const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: 1 });

    res.status(200).json({
      state: "success",
      message: "Announcements returned successfully",
      data: announcements,
    });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({
      state: "failed",
      message: "Failed to fetch announcements",
    });
  }
};

module.exports = { getAnnouncements };
