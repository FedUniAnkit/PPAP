const express = require('express');
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Protected routes (Admin/Staff only)
router.post('/', authenticate, authorize('admin', 'staff'), createCategory);
router.put('/:id', authenticate, authorize('admin', 'staff'), updateCategory);
router.delete('/:id', authenticate, authorize('admin', 'staff'), deleteCategory);

module.exports = router;
