const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Protect routes - verify token and set req.user
const protect = async (req, res, next) => {
  let token;
  console.log('Auth Headers:', req.headers.authorization);

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('Extracted token:', token);

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
      console.log('Decoded token:', decoded);

      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      console.log('Found user:', user);

      if (!user) {
        console.log('No user found with id:', decoded.id);
        return res.status(404).json({ error: 'User not found' });
      }

      // Ensure the user object has both id and _id
      req.user = {
        ...user.toObject(),
        id: user._id.toString()
      };
      
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(401).json({ error: 'Not authorized, token failed' });
    }
  } else {
    console.log('No token found in headers');
    return res.status(401).json({ error: 'Not authorized, no token' });
  }
};

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Not authorized as admin' });
  }
};

module.exports = { protect, admin }; 