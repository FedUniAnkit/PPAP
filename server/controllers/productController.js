const { Product } = require('../models');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ 
      where: { isActive: true }, // Only fetch active products
      order: [['name', 'ASC']]
    });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get a single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product && product.isActive) {
      res.status(200).json({ success: true, data: product });
    } else {
      res.status(404).json({ success: false, message: 'Product not found or is not available.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};


// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin/Staff
const createProduct = async (req, res) => {
  try {
    const { name, description, price, imageUrl, category } = req.body;
    const product = await Product.create({ name, description, price, imageUrl, category });
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid product data', error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin/Staff
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, imageUrl, category } = req.body;
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.imageUrl = imageUrl || product.imageUrl;
    product.category = category || product.category;

    const updatedProduct = await product.save();
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid product data', error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin/Staff
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.destroy();
    res.status(200).json({ success: true, message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
