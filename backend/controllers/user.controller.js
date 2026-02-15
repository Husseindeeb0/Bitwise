const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const BookSubmission = require('../models/BookSubmission');
const imagekit = require('../config/imageKit');

// Change user role
const changeUserRole = async (req, res) => {
  try {
    const { newRole, userId } = req.body;

    // Validate the new role
    const validRoles = ['user', 'admin'];
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({
        status: 'failed',
        message: 'Invalid role specified',
      });
    }

    // Update the target user's role
    const updatedUser = await User.findByIdAndUpdate(userId, { role: newRole });

    // Check if user was found and updated
    if (!updatedUser) {
      return res.status(404).json({
        status: 'failed',
        message: 'Target user not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'User role updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error changing user role:', error);
    res.status(500).json({
      status: 'failed',
      message: 'Internal server error',
    });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const [users, admins] = await Promise.all([
      // Query for regular users
      User.find({ role: 'user' })
        .select('_id username email accomplishments score createdAt')
        .sort({ createdAt: -1 }),

      // Query for admin users
      User.find({ role: 'admin' })
        .select('_id username email accomplishments score createdAt')
        .sort({ createdAt: -1 }),
    ]);

    // Return structured response with both sets of users
    res.status(200).json({
      state: 'success',
      message: 'Users & Admins returned successfully',
      data: {
        users,
        admins,
      },
    });
  } catch (error) {
    console.error('Error fetching user management data:', error);
    res.status(500).json({
      state: 'failed',
      message: 'Failed to fetch users and admins',
    });
  }
};

// Get user profile data with their announcement submissions
const getMe = async (req, res) => {
  try {
    const userId = req.userId;

    // Fetch user data and book submissions in parallel
    const [user, bookSubmissions] = await Promise.all([
      User.findById(userId).select('-password -refreshToken'),
      BookSubmission.find({ userId })
        .populate({
          path: 'announcementId',
          select:
            'title description date time location category mainImageUrl active bookFormId',
          populate: {
            path: 'bookFormId',
          },
        })
        .sort({ createdAt: -1 }),
    ]);

    if (!user) {
      return res.status(404).json({
        status: 'failed',
        message: 'User not found',
      });
    }

    // Map submissions to a cleaner structure for the frontend
    const announcements = bookSubmissions
      .filter((sub) => sub.announcementId !== null)
      .map((sub) => ({
        submissionId: sub._id,
        announcement: sub.announcementId,
        submittedAt: sub.createdAt,
      }));

    res.status(200).json({
      status: 'success',
      message: 'Profile data fetched successfully',
      data: {
        user,
        announcements,
      },
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      status: 'failed',
      message: 'Failed to fetch profile data',
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      username,
      email,
      image,
      coverImage,
      description,
      password,
      newPassword,
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        status: 'failed',
        message: 'User ID is required',
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'failed',
        message: 'User not found',
      });
    }

    // Handle Password Update logic
    if (newPassword) {
      if (!password) {
        return res.status(400).json({
          status: 'failed',
          message: 'Current password is required to set a new password',
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          status: 'failed',
          message: 'Invalid current password',
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    // Handle ImageKit Uploads
    if (image) {
      // Delete old profile image if exists
      if (user.profileImage && user.profileImage.fileId) {
        try {
          await imagekit.deleteFile(user.profileImage.fileId);
        } catch (err) {
          console.error('Error deleting old profile image:', err);
        }
      }

      // Upload new profile image
      const uploadResponse = await imagekit.upload({
        file: image,
        fileName: `profile_${userId}_${Date.now()}`,
        folder: '/profiles',
      });

      user.profileImage = {
        url: uploadResponse.url,
        fileId: uploadResponse.fileId,
      };
    }

    if (coverImage) {
      // Delete old cover image if exists
      if (user.coverImage && user.coverImage.fileId) {
        try {
          await imagekit.deleteFile(user.coverImage.fileId);
        } catch (err) {
          console.error('Error deleting old cover image:', err);
        }
      }

      // Upload new cover image
      const uploadResponse = await imagekit.upload({
        file: coverImage,
        fileName: `cover_${userId}_${Date.now()}`,
        folder: '/covers',
      });

      user.coverImage = {
        url: uploadResponse.url,
        fileId: uploadResponse.fileId,
      };
    }

    // Update other fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (description !== undefined) user.description = description;

    await user.save();

    // Remove password from response
    const updatedUser = user.toObject();
    delete updatedUser.password;
    delete updatedUser.refreshToken;

    res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      status: 'failed',
      message: error.message || 'Internal server error',
    });
  }
};

module.exports = { changeUserRole, getAllUsers, getMe, updateUser };
