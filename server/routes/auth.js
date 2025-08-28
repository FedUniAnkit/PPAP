const express = require('express');
const { 
  register, 
  login, 
  getMe, 
  forgotPassword, 
  resetPassword, 
  updatePassword,
  forcePasswordReset,
  checkPasswordReset, 
  updateForcedPassword 
} = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticate, getMe);

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', forgotPassword);

// @route   PATCH /api/auth/reset-password/:token
// @desc    Reset password with token
// @access  Public
router.patch('/reset-password/:token', resetPassword);

// @route   PATCH /api/auth/update-password
// @desc    Update current user's password
// @access  Private
router.patch('/update-password', authenticate, updatePassword);

// @route   GET /api/auth/check-password-reset
// @desc    Check if password reset is required
// @access  Private
router.get('/check-password-reset', authenticate, checkPasswordReset);

// @route   POST /api/auth/force-password-reset/:userId
// @desc    Force a user to reset their password (admin only)
// @access  Private/Admin
router.post('/force-password-reset/:userId', authenticate, authorize('admin'), forcePasswordReset);

// @route   PUT /api/auth/update-forced-password
// @desc    Update password when forced
// @access  Private
router.put('/update-forced-password', authenticate, updateForcedPassword);

module.exports = router;
