const User = require("../models/User");

const changeUserRole = async (req, res) => {
  try {
    const { newRole, userId } = req.body;

    // Validate the new role
    const validRoles = ['user', 'admin'];
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({ 
        status: 'failed',
        message: 'Invalid role specified' 
      });
    }

    // Update the target user's role
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { role: newRole }, 
    );

    // Check if user was found and updated
    if (!updatedUser) {
      return res.status(404).json({
        status: 'failed',
        message: 'Target user not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'User role updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error changing user role:', error);
    res.status(500).json({
      status: 'failed',
      message: 'Internal server error',
    });
  }
};

module.exports = { changeUserRole };