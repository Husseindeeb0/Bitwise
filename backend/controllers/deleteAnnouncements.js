const Announcement = require("../models/Announcements");

const deleteAnnouncements = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ 
        state: "failed", 
        message: "Announcement ID is required" 
      });
    }

    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return res.status(404).json({ 
        state: "failed", 
        message: "Announcement not found" 
      });
    }

    // Delete the announcement
    const deleted = await Announcement.findByIdAndDelete(id);

    return res.status(200).json({
      state: "success",
      message: "Announcement deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting announcement:", error);
    return res.status(500).json({
      state: "failed",
      message: "Failed to delete announcement",
    });
  }
};

module.exports = { deleteAnnouncements };