const Announcement = require("../models/Announcements");
const { v4: uuidv4 } = require("uuid");
const imagekit = require("../config/imageKit");

// Add announcements
const addAnnouncements = async (req, res) => {
  try {
    const { newAnnouncement } = req.body;
    const image = newAnnouncement.mainImageUrl;
    let newImageUrl;
    let newImageId;
    if (newAnnouncement.organizers.length > 0) {
      for (let i = 0; i < newAnnouncement.organizers.length; i++) {
        const fileName = `image_${uuidv4()}`;
        const uploadResponse = await imagekit.upload({
          file: newAnnouncement.organizers[i].imageUrl,
          fileName,
          useUniqueFileName: true,
        });

        newImageUrl = uploadResponse.url;
        newImageId = uploadResponse.fileId;
        newAnnouncement.organizers[i].imageUrl = newImageUrl;
        newAnnouncement.organizers[i].imageId = newImageId;
      }
    }

    if (image) {
      const fileName = `image_${uuidv4()}`;

      const uploadResponse = await imagekit.upload({
        file: image,
        fileName,
        useUniqueFileName: true,
      });

      newImageUrl = uploadResponse.url;
      newImageId = uploadResponse.fileId;
      newAnnouncement.mainImageUrl = newImageUrl;
      newAnnouncement.mainImageId = newImageId;
    }

    const announcement = new Announcement(newAnnouncement);

    // Save to database
    await announcement.save();

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

// Edit announcements
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
    });
  } catch (error) {
    console.error("Error updating announcement:", error);
    return res.status(500).json({
      state: "failed",
      message: "Failed to update announcement",
    });
  }
};

// Delete announcements
const deleteAnnouncements = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        state: "failed",
        message: "Announcement ID is required",
      });
    }

    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return res.status(404).json({
        state: "failed",
        message: "Announcement not found",
      });
    }

    // Delete the images
    for (let i = 0; i < announcement.organizers.length; i++) {
      const oldId = announcement.organizers[i].imageId;
      await imagekit.deleteFile(oldId);
    }

    const oldmainImageId = announcement.mainImageId;
    await imagekit.deleteFile(oldmainImageId);

    // Delete the announcement
    await Announcement.findByIdAndDelete(id);

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

// Get announcements
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: 1 });

    res.status(200).json({
      state: "success",
      message: "Announcements returned successfully",
      announcementsData: announcements,
    });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({
      state: "failed",
      message: "Failed to fetch announcements",
    });
  }
};

// Get announcement by Id
const getAnnouncementById = async (req, res) => {
  const { id } = req.params;
  try {
    const announcement = await Announcement.findById(id);

    res.status(200).json({
      state: "success",
      message: "Announcement returned successfully",
      announcementData: announcement,
    });
  } catch (error) {
    console.error("Error fetching announcement:", error);
    res.status(500).json({
      state: "failed",
      message: "Failed to fetch announcement",
    });
  }
};

// Get latest announcement
const getLatestAnnouncement = async (req, res) => {
  try {
    const latestAnnouncement = await Announcement.findOne().sort({
      createdAt: -1,
    });
    res.status(200).json({
      state: "success",
      message: "Latest Announcement is fetched successfully",
      announcementData: latestAnnouncement,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      state: "failed",
      message: "Failed to fetch latest announcement",
    });
  }
};

module.exports = {
  addAnnouncements,
  editAnnouncements,
  deleteAnnouncements,
  getAnnouncements,
  getAnnouncementById,
  getLatestAnnouncement,
};
