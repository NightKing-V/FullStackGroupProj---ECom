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

// Middleware to check if the user is an admin
const isAdmin = async (req, res, next) => {
    try {
      const user = await User.findById(req.user.userId);
  
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
  
      if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admins only' });
      }
  
      next(); // Proceed if the user is an admin
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  // Middleware to check for valid access key
const validateAccessKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const timestamp = req.headers['x-timestamp'];

  // Check if the API key is correct
  if (apiKey !== process.env.PAYMENT_API_KEY) {
    return res.status(403).json({ error: 'Forbidden: Invalid API key' });
  }

  // Check if the timestamp is within acceptable range (e.g., 5 minutes)
  const currentTime = Math.floor(Date.now() / 1000); // Time in seconds
  if (Math.abs(currentTime - timestamp) > 300) {
    return res.status(400).json({ error: 'Request expired' });
  }

  next();
};


  module.exports = { authenticate, isAdmin, validateAccessKey };
