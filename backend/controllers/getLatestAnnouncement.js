const Announcement = require("../models/Announcements");

const getLatestAnnouncement = async (req, res) => {
  try {
    const latestAnnouncement = await Announcement.findOne().sort({
      createdAt: -1,
    });
    res
      .status(200)
      .json({
        state: "success",
        message: "Latest Announcement is fetched successfully",
        data: latestAnnouncement,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      state: "failed",
      message: "Failed to fetch latest announcement",
    });
  }
};

module.exports = { getLatestAnnouncement };
