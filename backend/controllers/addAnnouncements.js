const Announcement = require("../models/Announcements");
const { v4: uuidv4 } = require('uuid');
const imagekit = require("../config/imageKit");

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

module.exports = { addAnnouncements };
