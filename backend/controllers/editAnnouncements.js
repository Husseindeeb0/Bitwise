const Announcement = require("../models/Announcements");
const { v4: uuidv4 } = require('uuid');
const imagekit = require("../config/imagekit");

const editAnnouncements = async (req, res) => {
  try {
    const { updatedAnnouncement } = req.body;
    const mainImageUrl = updatedAnnouncement.mainImageUrl;
    const announcementId = updatedAnnouncement._id || updatedAnnouncement.id;

    if (!announcementId) {
      return res.status(400).json({
        state: "failed",
        message: "Announcement ID is required",
      });
    }

    const announcement = await Announcement.findById(announcementId);

    if (!announcement) {
      return res.status(404).json({
        state: "failed",
        message: "Announcement not found",
      });
    }

    if (updatedAnnouncement.organizers.length > 0) {
      for (let i = 0; i < updatedAnnouncement.organizers.length; i++) {
        const imageUrl = updatedAnnouncement.organizers[i].imageUrl;
        if (
          imageUrl &&
          typeof imageUrl === "string" &&
          imageUrl.startsWith("http") &&
          imageUrl === announcement.organizers[i].imageUrl
        ) {
          continue;
        }
        const oldId = announcement.organizers?.[i]?.imageId;

        try {
          if (oldId) {
            await imagekit.deleteFile(oldId);
          }
        } catch (error) {
          console.log(`Failed to delete file ${oldId}: `, error.message);
        }

        const fileName = `image_${uuidv4()}`;
        const uploadResponse = await imagekit.upload({
          file: updatedAnnouncement.organizers[i].imageUrl,
          fileName,
          useUniqueFileName: true,
        });

        const updatedImageUrl = uploadResponse.url;
        const updatedImageId = uploadResponse.fileId;
        updatedAnnouncement.organizers[i].imageUrl = updatedImageUrl;
        updatedAnnouncement.organizers[i].imageId = updatedImageId;
      }
    }

    if (
      typeof mainImageUrl === "string" &&
      !mainImageUrl.startsWith("http") &&
      mainImageUrl !== announcement.mainImageUrl
    ) {
      const oldMainImageId = announcement.mainImageId;

      try {
        if (oldMainImageId) {
          await imagekit.deleteFile(oldMainImageId);
        }
      } catch (error) {
        console.log(`Failed to delete file ${oldMainImageId}: `, error.message);
      }

      const fileName = `image_${uuidv4()}`;

      const uploadResponse = await imagekit.upload({
        file: mainImageUrl,
        fileName,
        useUniqueFileName: true,
      });

      const updatedImageUrl = uploadResponse.url;
      const updatedImageId = uploadResponse.fileId;
      updatedAnnouncement.mainImageUrl = updatedImageUrl;
      updatedAnnouncement.mainImageId = updatedImageId;
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
      data: updated,
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
