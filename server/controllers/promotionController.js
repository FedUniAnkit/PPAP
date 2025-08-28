const { Promotion } = require('../models');

// @desc    Create a new promotion
// @route   POST /api/promotions
// @access  Private/Admin
const createPromotion = async (req, res) => {
  try {
    const { code, description, discountType, amount, startDate, endDate, isActive } = req.body;

    const promotion = await Promotion.create({
      code,
      description,
      discountType,
      amount,
      startDate,
      endDate,
      isActive,
    });

    res.status(201).json({ success: true, data: promotion });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all promotions
// @route   GET /api/promotions
// @access  Public
const getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.findAll({ where: { isActive: true } });
    res.json({ success: true, data: promotions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single promotion by ID
// @route   GET /api/promotions/:id
// @access  Public
const getPromotionById = async (req, res) => {
  try {
    const promotion = await Promotion.findByPk(req.params.id);

    if (promotion) {
      res.json({ success: true, data: promotion });
    } else {
      res.status(404).json({ success: false, message: 'Promotion not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a promotion
// @route   PUT /api/promotions/:id
// @access  Private/Admin
const updatePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByPk(req.params.id);

    if (promotion) {
      const { code, description, discountType, amount, startDate, endDate, isActive } = req.body;
      
      promotion.code = code || promotion.code;
      promotion.description = description || promotion.description;
      promotion.discountType = discountType || promotion.discountType;
      promotion.amount = amount || promotion.amount;
      promotion.startDate = startDate || promotion.startDate;
      promotion.endDate = endDate || promotion.endDate;
      promotion.isActive = isActive === undefined ? promotion.isActive : isActive;

      const updatedPromotion = await promotion.save();
      res.json({ success: true, data: updatedPromotion });
    } else {
      res.status(404).json({ success: false, message: 'Promotion not found' });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a promotion
// @route   DELETE /api/promotions/:id
// @access  Private/Admin
const deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByPk(req.params.id);

    if (promotion) {
      await promotion.destroy();
      res.json({ success: true, message: 'Promotion removed' });
    } else {
      res.status(404).json({ success: false, message: 'Promotion not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createPromotion,
  getAllPromotions,
  getPromotionById,
  updatePromotion,
  deletePromotion,
};
