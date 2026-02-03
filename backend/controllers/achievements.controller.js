const Achievement = require('../models/Achievements');
const { v4: uuidv4 } = require('uuid');
const imagekit = require('../config/imageKit');

// Add announcements
const addAchievements = async (req, res) => {
  try {
    const { newAchievements } = req.body;
    const image = newAchievements.imageUrl;
    let newImageUrl;
    let newImageId;

    if (image) {
      const fileName = `image_${uuidv4()}`;

      const uploadResponse = await imagekit.upload({
        file: image,
        fileName,
        useUniqueFileName: true,
      });

      newImageUrl = uploadResponse.url;
      newImageId = uploadResponse.fileId;
      newAchievements.imageUrl = newImageUrl;
      newAchievements.imageId = newImageId;
    }

    const achievement = new Achievement(newAchievements);

    // Save to database
    await achievement.save();

    return res.status(201).json({
      message: 'Achievement added successfully',
    });
  } catch (error) {
    console.error('Error adding achievement:', error);
    return res.status(500).json({
      message: 'Failed to add achievement',
      error: error,
    });
  }
};

// Edit announcements
const editAchievements = async (req, res) => {
  try {
    const { updatedAchievement } = req.body;
    const mainImageUrl = updatedAchievement.imageUrl;
    const achievementId = updatedAchievement._id || updatedAchievement.id;

    if (!achievementId) {
      return res.status(400).json({
        message: 'Achievement ID is required',
      });
    }

    const achievement = await Achievement.findById(achievementId);

    if (!achievement) {
      return res.status(404).json({
        message: 'Announcement not found',
      });
    }

    if (
      typeof mainImageUrl === 'string' &&
      !mainImageUrl.startsWith('http') &&
      mainImageUrl !== achievement.imageUrl
    ) {
      const oldMainImageId = achievement.imageId;

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
      updatedAchievement.imageUrl = updatedImageUrl;
      updatedAchievement.imageId = updatedImageId;
    }

    // Update the announcement with new values and return the updated document
    await Achievement.findByIdAndUpdate(
      achievementId,
      { $set: updatedAchievement },
      { new: true, runValidators: true } // new: Return updatedAnnouncement, runValidators: run schema validators
    );

    return res.status(200).json({
      message: 'Achievement updated successfully',
    });
  } catch (error) {
    console.error('Error updating achievement:', error);
    return res.status(500).json({
      message: 'Failed to update achievement',
    });
  }
};

const deleteAchievements = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: 'Achievement ID is required',
      });
    }

    const achievement = await Achievement.findById(id);

    if (!achievement) {
      return res.status(404).json({
        message: 'Achievement not found',
      });
    }

    const oldMainImageId = achievement.imageId;

    if (oldMainImageId) {
      try {
        await imagekit.deleteFile(oldMainImageId);
      } catch (imageError) {
        console.log(
          `Failed to delete image ${oldMainImageId}:`,
          imageError.message
        );
      }
    }

    await Achievement.findByIdAndDelete(id);

    return res.status(200).json({
      message: 'Achievement deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting achievement:', error);
    return res.status(500).json({
      message: 'Failed to delete achievement',
    });
  }
};

const getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ createdAt: 1 });

    res.status(200).json({
      message: 'Achievement returned successfully',
      achievementsData: achievements,
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({
      message: 'Failed to fetch achievements',
    });
  }
};

const getAchievementById = async (req, res) => {
  const { id } = req.params;
  try {
    const achievement = await Achievement.findById(id);

    res.status(200).json({
      message: 'Achievement returned successfully',
      achievementData: achievement,
    });
  } catch (error) {
    console.error('Error fetching achievement:', error);
    res.status(500).json({
      message: 'Failed to fetch achievement',
    });
  }
};

const getLatestAchievement = async (req, res) => {
  try {
    const latestAchievement = await Achievement.findOne({
      active: true,
    }).sort({
      createdAt: -1,
    });

    if (!latestAchievement) {
      return res.status(404).json({
        message: 'No active achievement found',
      });
    }

    res.status(200).json({
      message: 'Latest Achievement is fetched successfully',
      achievementData: latestAchievement,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch latest achievement',
    });
  }
};

module.exports = {
  addAchievements,
  editAchievements,
  deleteAchievements,
  getAchievements,
  getAchievementById,
  getLatestAchievement,
};
