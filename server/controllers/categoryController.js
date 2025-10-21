const { Category, Product } = require('../models');
const { Op } = require('sequelize');

// Helper function to transform category data
const transformCategoryData = (category) => {
  const categoryData = category.toJSON ? category.toJSON() : category;

  // Ensure sortOrder is a number
  if (categoryData.sortOrder !== undefined) {
    categoryData.sortOrder = parseInt(categoryData.sortOrder);
  }

  return categoryData;
};

// @desc    Get all categories with product counts
// @route   GET /api/categories
// @access  Public
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['sortOrder', 'ASC'], ['displayName', 'ASC']]
    });

    // Get product counts for each category
    const categoryCounts = await Product.findAll({
      attributes: [
        'category',
        [Product.sequelize.fn('COUNT', Product.sequelize.col('id')), 'count']
      ],
      where: { isAvailable: true },
      group: ['category'],
      raw: true
    });

    // Merge counts into categories
    const categoriesWithCounts = categories.map(category => {
      const countData = categoryCounts.find(c => c.category === category.name);
      return {
        ...transformCategoryData(category),
        productCount: countData ? parseInt(countData.count) : 0
      };
    });

    res.status(200).json({
      success: true,
      data: categoriesWithCounts,
      count: categoriesWithCounts.length
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get a single category by ID
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (category) {
      res.status(200).json({ success: true, data: transformCategoryData(category) });
    } else {
      res.status(404).json({ success: false, message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin/Staff
const createCategory = async (req, res) => {
  try {
    const { name, displayName, description, sortOrder } = req.body;

    // Validation
    if (!name || !displayName) {
      return res.status(400).json({
        success: false,
        message: 'Name and display name are required'
      });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    const categoryData = {
      name: name.trim(),
      displayName: displayName.trim(),
      description: description?.trim() || '',
      sortOrder: parseInt(sortOrder) || 0
    };

    const category = await Category.create(categoryData);
    res.status(201).json({
      success: true,
      data: transformCategoryData(category),
      message: 'Category created successfully'
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create category',
      error: error.message
    });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin/Staff
const updateCategory = async (req, res) => {
  try {
    const { name, displayName, description, sortOrder } = req.body;

    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Check if new name conflicts with existing category
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ where: { name } });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Category with this name already exists'
        });
      }
    }

    // Update fields only if provided
    if (name !== undefined) category.name = name.trim();
    if (displayName !== undefined) category.displayName = displayName.trim();
    if (description !== undefined) category.description = description.trim();
    if (sortOrder !== undefined) category.sortOrder = parseInt(sortOrder);

    const updatedCategory = await category.save();

    res.status(200).json({
      success: true,
      data: transformCategoryData(updatedCategory),
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update category',
      error: error.message
    });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin/Staff
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Check if category has products
    const productCount = await Product.count({ where: { category: category.name } });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. ${productCount} product(s) are using this category.`
      });
    }

    await category.destroy();
    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
