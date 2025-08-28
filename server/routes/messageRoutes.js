const express = require('express');
const { getMessagesForOrder, sendMessage } = require('../controllers/messageController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All routes in this file are protected
router.use(authenticate);

// Get all messages for a specific order
router.get('/:orderId', getMessagesForOrder);

// Send a new message for a specific order
router.post('/:orderId', sendMessage);

module.exports = router;
