const express = require('express');
const {
  createPromotion,
  getAllPromotions,
  getPromotionById,
  updatePromotion,
  deletePromotion,
} = require('../controllers/promotionController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getAllPromotions);
router.get('/:id', getPromotionById);

// Admin-only routes
router.post('/', authenticate, authorize('admin'), createPromotion);
router.put('/:id', authenticate, authorize('admin'), updatePromotion);
router.delete('/:id', authenticate, authorize('admin'), deletePromotion);

module.exports = router;
