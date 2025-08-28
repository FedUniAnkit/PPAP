const express = require('express');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// These are public routes
router.route('/')
  .get(getAllProducts)
  .post(authenticate, authorize('admin', 'staff'), createProduct);

router.route('/:id')
  .get(getProductById)
  .put(authenticate, authorize('admin', 'staff'), updateProduct)
  .delete(authenticate, authorize('admin', 'staff'), deleteProduct);

module.exports = router;
