const express = require('express');
const router = express.Router();
const {
  getAllContent,
  getContentByKey,
  createContentBlock,
  updateContentBlock,
  deleteContentBlock,
} = require('../controllers/contentController');
const { authenticate, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getAllContent);
router.get('/:slug', getContentByKey);

// Admin routes - protected
router.post('/', authenticate, authorize('admin'), createContentBlock);
router.put('/:id', authenticate, authorize('admin'), updateContentBlock);
router.delete('/:id', authenticate, authorize('admin'), deleteContentBlock);

module.exports = router;
