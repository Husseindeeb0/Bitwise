const jwt = require('jsonwebtoken');
const User = require('../models/User');

const checkUserRole = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(403).json({ message: 'Token required' });
    }

    // Decode the token to get the user info (role included)
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
    const userId = decoded.userId;

    // Fetch the user from the database to ensure it is a valid user and check their role
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ status: "failed", message: 'User not found' });
    }

    // Send back the user's role
    return res.status(200).json({ role: user.role });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "failed", message: 'Internal server error' });
  }
};

module.exports = { checkUserRole };
