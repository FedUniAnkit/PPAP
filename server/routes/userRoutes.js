const express = require('express');
const { getMe } = require('../controllers/authController');
const { 
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  setUserStatus,
  adminResetPassword,
  updateProfile
} = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get current user's profile (available to all authenticated users)
router.get('/me', getMe);

// Allow users to update their own profile
router.put('/me', updateProfile);

// Admin-only routes
router.use(authorize('admin'));

router.route('/')
  .get(getUsers);

router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

router.route('/:id/status').put(setUserStatus);
router.route('/:id/reset-password').post(adminResetPassword);

module.exports = router;
