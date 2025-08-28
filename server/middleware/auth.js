const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticate = async (req, res, next) => {
  try {
    console.log('Authentication middleware called for:', req.method, req.path);
    
    // Get token from Authorization header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid authorization header found');
      return res.status(401).json({ 
        success: false,
        message: 'Access denied. No valid token provided.' 
      });
    }
    
    const token = authHeader.replace('Bearer ', '').trim();
    
    if (!token) {
      console.log('Empty token provided');
      return res.status(401).json({ 
        success: false,
        message: 'Access denied. No token provided.' 
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token verified for user ID:', decoded.userId);
    } catch (jwtError) {
      console.error('Token verification failed:', jwtError.message);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid or expired token.',
        error: jwtError.message
      });
    }

    // Find user
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      console.log('User not found for token, user ID:', decoded.userId);
      return res.status(401).json({ 
        success: false,
        message: 'User not found for this token.' 
      });
    }

    // Check if user is active
    if (!user.isActive) {
      console.log('User account is deactivated for:', user.email);
      return res.status(403).json({ 
        success: false,
        message: 'Account is deactivated. Please contact support.' 
      });
    }

    console.log('Authentication successful for user:', user.email);
    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Authentication failed',
      error: error.message 
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Access denied. Insufficient permissions.' 
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
