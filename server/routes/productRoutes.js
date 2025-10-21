const express = require('express');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCustomizationOptions,
  getProductCategories,
  getAllProductsAdmin,
  bulkUpdateProductStatus,
  getProductStats,
} = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/categories', getProductCategories);
router.get('/customization-options', getCustomizationOptions);

router.route('/')
  .get(getAllProducts)
  .post(authenticate, authorize('admin', 'staff'), createProduct);

router.route('/:id')
  .get(getProductById)
  .put(authenticate, authorize('admin', 'staff'), updateProduct)
  .delete(authenticate, authorize('admin', 'staff'), deleteProduct);

// Admin-only routes
router.get('/admin/all', authenticate, authorize('admin'), getAllProductsAdmin);
router.get('/admin/stats', authenticate, authorize('admin'), getProductStats);
router.patch('/admin/bulk-status', authenticate, authorize('admin'), bulkUpdateProductStatus);

module.exports = router;
