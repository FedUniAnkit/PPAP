const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { generateToken } = require('../config/auth');
const emailService = require('../utils/emailService');
const { sequelize } = require('../config/database');

// Generate random token for password reset
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Hash the reset token
const hashResetToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// Register user
const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'customer'
    });

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ message: error.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        forcePasswordReset: user.forcePasswordReset
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current user
const getMe = async (req, res) => {
  try {
    console.log('getMe called for user ID:', req.user?.id);
    
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'passwordResetToken', 'passwordResetExpires'] }
    });

    if (!user) {
      console.log('User not found in database for ID:', req.user.id);
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    console.log('User found, returning data for:', user.email);
    const response = { 
      success: true, 
      user: user.toJSON()
    };
    
    res.json(response);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch user data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // 1) Get user based on email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If your email exists in our system, you will receive a password reset link.'
      });
    }

    // 2) Generate random reset token
    const resetToken = generateResetToken();
    const hashedToken = hashResetToken(resetToken);
    
    // 3) Save hashed token and expiry (10 minutes from now)
    await user.update({
      passwordResetToken: hashedToken,
      passwordResetExpires: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    try {
      // 4) Send email with reset token
      await emailService.sendPasswordResetEmail(user, resetToken);
      
      res.status(200).json({
        success: true,
        message: 'Password reset link sent to email!'
      });
    } catch (error) {
      // If email sending fails, clear the reset token
      await user.update({
        passwordResetToken: null,
        passwordResetExpires: null
      });
      
      console.error('Error sending email:', error);
      return res.status(500).json({
        success: false,
        message: 'There was an error sending the email. Please try again later.'
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request.'
    });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a new password.'
      });
    }

    // 1) Hash the token from the URL
    const hashedToken = hashResetToken(token);
    
    // 2) Find user by token and check if it's not expired
    const user = await User.findOne({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { [Sequelize.Op.gt]: Date.now() }
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token is invalid or has expired.'
      });
    }

    // 3) Update user's password and clear reset token
    user.password = password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    user.passwordChangedAt = Date.now();
    user.forcePasswordReset = false;
    
    await user.save();
    
    // 4) Log the user in (send token)
    const authToken = generateToken(user.id);
    
    res.status(200).json({
      success: true,
      token: authToken,
      message: 'Password reset successful!'
    });
    
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while resetting your password.'
    });
  }
};

// Update password (for logged-in users)
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // 1) Get user
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }
    
    // 2) Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Your current password is incorrect.'
      });
    }
    
    // 3) Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // 4) Direct SQL update to bypass any hooks
    await sequelize.query(
      'UPDATE "Users" SET password = $1, "passwordChangedAt" = $2, "updatedAt" = $3 WHERE id = $4',
      {
        bind: [hashedPassword, new Date(), new Date(), user.id],
        type: sequelize.QueryTypes.UPDATE
      }
    );
    
    // 5) Generate new token
    const token = generateToken(user.id);
    
    res.status(200).json({
      success: true,
      token,
      message: 'Password updated successfully!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('Update password error:', error);
    
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating your password.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Force password reset (for admins)
const forcePasswordReset = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to perform this action.'
      });
    }
    
    // Find user and force password reset
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }
    
    // Set force password reset flag
    user.forcePasswordReset = true;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'User will be required to reset their password on next login.'
    });
    
  } catch (error) {
    console.error('Force password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while forcing password reset.'
    });
  }
};

// Check if password reset is required
const checkPasswordReset = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    res.status(200).json({
      success: true,
      forcePasswordReset: user.forcePasswordReset
    });
    
  } catch (error) {
    console.error('Check password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while checking password reset status.'
    });
  }
};

// Update password when forced
const updateForcedPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user.forcePasswordReset) {
      return res.status(403).json({
        success: false,
        message: 'You are not required to reset your password.',
      });
    }

    user.password = newPassword;
    user.passwordChangedAt = Date.now();
    user.forcePasswordReset = false;

    await user.save();

    const token = generateToken(user.id);

    const updatedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      forcePasswordReset: user.forcePasswordReset,
    };

    res.status(200).json({
      success: true,
      token,
      user: updatedUser,
      message: 'Password updated successfully!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating your password.',
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword,
  forcePasswordReset,
  checkPasswordReset,
  updateForcedPassword,
};
