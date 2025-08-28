const express = require('express');
const { getSalesAnalytics, getProductAnalytics } = require('../controllers/analyticsController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes in this file are protected and for admins only
router.use(authenticate);
router.use(authorize('admin'));

// Get sales analytics data
router.get('/sales', getSalesAnalytics);

// Get product analytics data
router.get('/products', getProductAnalytics);

module.exports = router;
