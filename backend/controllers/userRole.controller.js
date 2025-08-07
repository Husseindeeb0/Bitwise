const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Get user role
const getUserRole = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(403).json({ message: "Token required" });
    }

    // Decode the token to get the user info (role included)
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
    const userId = decoded.userId;

    // Fetch the user from the database to ensure it is a valid user and check their role
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "failed", message: "User not found" });
    }

    // Send back the user's role
    return res
      .status(200)
      .json({
        state: "success",
        message: "Role returned successfully",
        role: user.role,
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
};

// Change user role
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

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const [users, admins] = await Promise.all([
      // Query for regular users
      User.find({ role: "user" })
        .select("_id username email accomplishments score createdAt")
        .sort({ createdAt: -1 }),

      // Query for admin users
      User.find({ role: "admin" })
        .select("_id username email accomplishments score createdAt")
        .sort({ createdAt: -1 }),
    ]);

    // Return structured response with both sets of users
    res.status(200).json({
      state: "success",
      message: "Users & Admins returned successfully",
      data: {
        users,
        admins,
        counts: {
          users: users.length,
          admins: admins.length,
          total: users.length + admins.length,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user management data:", error);
    res.status(500).json({
      state: "failed",
      message: "Failed to fetch users and admins",
    });
  }
};

module.exports = { getUserRole, changeUserRole, getAllUsers };
