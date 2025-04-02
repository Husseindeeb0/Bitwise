const User = require("../models/User");

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

module.exports = { getAllUsers };