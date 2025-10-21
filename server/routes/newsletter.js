const express = require('express');
const router = express.Router();
const {
  subscribe,
  getAllSubscribers,
  sendMarketingEmail,
} = require('../controllers/newsletterController');
const { authenticate, authorize } = require('../middleware/auth');

// @route   POST /api/newsletter/subscribe
// @desc    Subscribe to the newsletter
// @access  Public
router.post('/subscribe', subscribe);

// @route   GET /api/newsletter/subscribers
// @desc    Get all newsletter subscribers (Admin only)
// @access  Private/Admin
router.get('/subscribers', authenticate, authorize('admin'), getAllSubscribers);

// @route   POST /api/newsletter/send-marketing-email
// @desc    Send a marketing email to all subscribers (Admin only)
// @access  Private/Admin
router.post('/send-marketing-email', authenticate, authorize('admin'), sendMarketingEmail);

module.exports = router;
