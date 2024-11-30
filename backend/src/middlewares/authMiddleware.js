const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const authenticate = async (req, res, next) => {
  try {

    // Extract token from Authorization header (Bearer)
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next(); // Continue
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized', error: error.message });
  }
};

module.exports = authenticate;
