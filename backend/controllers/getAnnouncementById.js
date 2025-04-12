const Announcement = require("../models/Announcements");

const getAnnouncementById = async (req, res) => {
  const { id } = req.params;
  try {
    const announcement = await Announcement.findById(id);

    res.status(200).json({
      state: "success",
      message: "Announcement returned successfully",
      data: announcement,
    });
  } catch (error) {
    console.error("Error fetching announcement:", error);
    res.status(500).json({
      state: "failed",
      message: "Failed to fetch announcement",
    });
  }
};

module.exports = { getAnnouncementById };
