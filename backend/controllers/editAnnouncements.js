const Announcement = require("../models/Announcements");

const editAnnouncements = async (req, res) => {
  try {
    const { updatedAnnouncement } = req.body;
    const announcementId = updatedAnnouncement._id || updatedAnnouncement.id;

    if (!announcementId) {
      return res.status(400).json({ 
        state: "failed", 
        message: "Announcement ID is required" 
      });
    }

    const announcement = await Announcement.findById(announcementId);

    if (!announcement) {
      return res.status(404).json({ 
        state: "failed", 
        message: "Announcement not found" 
      });
    }

    // Update the announcement with new values and return the updated document
    const updated = await Announcement.findByIdAndUpdate(
      announcementId,
      { $set: updatedAnnouncement },
      { new: true, runValidators: true } // new: Return updatedAnnouncement, runValidators: run schema validators
    );

    return res.status(200).json({
      state: "success",
      message: "Announcement updated successfully",
      data: updated
    });

  } catch (error) {
    console.error("Error updating announcement:", error);
    return res.status(500).json({
      state: "failed",
      message: "Failed to update announcement",
    });
  }
};

module.exports = { editAnnouncements };