const jwt = require('jsonwebtoken');
require('dotenv').config();

// Provide a safe dev fallback, but require explicit secret outside development
const isDev = (process.env.NODE_ENV || 'development') === 'development';
const JWT_SECRET = process.env.JWT_SECRET || (isDev ? 'dev_secret_change_me' : undefined);
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
  // Fail fast in non-dev environments to avoid runtime errors
  console.error('JWT_SECRET is not set. Please define it in server/.env');
}

const generateToken = (userId) => {
  if (!JWT_SECRET) {
    throw new Error('JWT secret is not configured');
  }
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const verifyToken = (token) => {
  if (!JWT_SECRET) {
    throw new Error('JWT secret is not configured');
  }
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken,
};
