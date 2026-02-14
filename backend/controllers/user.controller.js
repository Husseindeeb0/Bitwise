const jwt = require('jsonwebtoken');
const User = require('../models/User');
const BookSubmission = require('../models/BookSubmission');

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
            'title description date time location category mainImageUrl active',
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

module.exports = { changeUserRole, getAllUsers, getMe };
