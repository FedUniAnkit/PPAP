const { NewsletterSubscription } = require('../models');
const emailService = require('../utils/emailService');

// @desc    Subscribe to the newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
const subscribe = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required.' });
  }

  try {
    const [subscription, created] = await NewsletterSubscription.findOrCreate({
      where: { email },
      defaults: { isActive: true },
    });

    if (!created && !subscription.isActive) {
      // Resubscribe if they were previously inactive
      subscription.isActive = true;
      await subscription.save();
    }

    res.status(201).json({ success: true, message: 'Thank you for subscribing!' });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ success: false, message: 'This email is already subscribed.' });
    }
    if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }
    res.status(500).json({ success: false, message: 'Subscription failed. Please try again later.', error: error.message });
  }
};

// @desc    Get all newsletter subscribers
// @route   GET /api/newsletter/subscribers
// @access  Private/Admin
const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await NewsletterSubscription.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json({ success: true, data: subscribers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch subscribers.', error: error.message });
  }
};

// @desc    Send a marketing email to all subscribers
// @route   POST /api/newsletter/send-marketing-email
// @access  Private/Admin
const sendMarketingEmail = async (req, res) => {
  const { subject, content } = req.body;
  if (!subject || !content) {
    return res.status(400).json({ success: false, message: 'Email subject and content are required.' });
  }

  try {
    const subscribers = await NewsletterSubscription.findAll({ where: { isActive: true } });
    if (subscribers.length === 0) {
      return res.status(404).json({ success: false, message: 'No active subscribers found.' });
    }

    const recipientEmails = subscribers.map(s => s.email);
    await emailService.sendBulkMarketingEmail(recipientEmails, subject, content);

    res.status(200).json({ success: true, message: `Marketing email sent to ${recipientEmails.length} subscribers.` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send marketing email.', error: error.message });
  }
};

module.exports = {
  subscribe,
  getAllSubscribers,
  sendMarketingEmail,
};
