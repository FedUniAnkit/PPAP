const { User } = require('../models');
const crypto = require('crypto');
const { sendPasswordResetByAdminEmail } = require('../utils/emailService');
const { validationResult } = require('express-validator');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const { search, role, status, sortBy, order } = req.query;
    let where = {};
    let ordering = [];

    if (search) {
      where[require('sequelize').Op.or] = [
        { name: { [require('sequelize').Op.iLike]: `%${search}%` } },
        { email: { [require('sequelize').Op.iLike]: `%${search}%` } },
      ];
    }

    if (role) where.role = role;
    if (status) where.isActive = status === 'active';

    if (sortBy) {
      ordering.push([sortBy, order === 'desc' ? 'DESC' : 'ASC']);
    }

    const users = await User.findAll({
      where,
      order: ordering,
      attributes: { exclude: ['password'] },
    });

    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    });

    if (user) {
      res.json({ success: true, data: user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (user) {
      const { name, email, role, isActive } = req.body;

      user.name = name || user.name;
      user.email = email || user.email;
      user.role = role || user.role;
      user.isActive = isActive === undefined ? user.isActive : isActive;

      // Admins should not be able to update passwords directly here
      // A separate password reset flow should be used.

      const updatedUser = await user.save();
      const userResponse = updatedUser.toJSON();
      delete userResponse.password;

      res.json({ success: true, data: userResponse });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (user) {
      // Prevent admin from deleting themselves
      if (user.id === req.user.id) {
        return res.status(400).json({ success: false, message: 'You cannot delete your own account.' });
      }
      await user.destroy();
      res.json({ success: true, message: 'User removed' });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Set user's active status
// @route   PUT /api/users/:id/status
// @access  Private/Admin
const setUserStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent admin from deactivating themselves
    if (user.id === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot change your own status.' });
    }

    const { isActive } = req.body;
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ success: false, message: 'isActive must be a boolean.' });
    }

    user.isActive = isActive;
    await user.save();

    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json({ success: true, data: userResponse, message: `User has been ${isActive ? 'activated' : 'deactivated'}.` });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Admin resets a user's password
// @route   POST /api/users/:id/reset-password
// @access  Private/Admin
const adminResetPassword = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const resetToken = user.getPasswordResetToken();
    await user.save({ validate: false });

    // Send email to user with reset link
    await sendPasswordResetByAdminEmail(user, resetToken);

    res.json({ success: true, message: `Password reset link sent to ${user.email}` });
  } catch (error) {
    console.error('Admin password reset error:', error);
    res.status(500).json({ success: false, message: 'Failed to send password reset email.' });
  }
};

// @desc    Update current user's profile
// @route   PUT /api/users/me
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array(),
        message: 'Validation error' 
      });
    }

    const { name, email, phone } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email already in use' 
        });
      }
      user.email = email;
    }

    // Update user fields
    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();

    // Remove password from response
    const userJson = user.toJSON();
    delete userJson.password;

    res.json({ 
      success: true, 
      data: userJson,
      message: 'Profile updated successfully' 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  setUserStatus,
  adminResetPassword,
  updateProfile,
};
