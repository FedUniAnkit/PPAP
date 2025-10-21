const { Order, OrderItem, Product, User } = require('../models');
const { Op, Sequelize } = require('sequelize');

// @desc    Get sales analytics
// @route   GET /api/analytics/sales
// @access  Private/Admin
const getSalesAnalytics = async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    
    let groupBy, dateFormat, dateTrunc;
    
    switch (period) {
      case 'weekly':
        dateFormat = '%Y-%U';
        dateTrunc = 'week';
        break;
      case 'yearly':
        dateFormat = '%Y';
        dateTrunc = 'year';
        break;
      case 'monthly':
      default:
        dateFormat = '%Y-%m';
        dateTrunc = 'month';
    }

    const salesData = await Order.findAll({
      attributes: [
        [Sequelize.fn('date_trunc', dateTrunc, Sequelize.col('createdAt')), 'period'],
        [Sequelize.fn('sum', Sequelize.col('totalPrice')), 'totalSales'],
        [Sequelize.fn('count', Sequelize.col('id')), 'orderCount']
      ],
      where: {
        status: { [Op.not]: 'cancelled' },
        createdAt: {
          [Op.gte]: new Date(new Date() - 365 * 24 * 60 * 60 * 1000) // Last 365 days
        }
      },
      group: ['period'],
      order: [['period', 'ASC']],
      raw: true
    });

    res.json({ success: true, data: salesData });
  } catch (error) {
    console.error('Sales analytics error:', error);
    res.status(500).json({ success: false, message: 'Error fetching sales analytics' });
  }
};

// @desc    Get product analytics
// @route   GET /api/analytics/products
// @access  Private/Admin
const getProductAnalytics = async (req, res) => {
  try {
    const { limit = 10, period = 'month' } = req.query;
    
    const productData = await OrderItem.findAll({
      attributes: [
        'productId',
        [Sequelize.col('Product.name'), 'productName'],
        [Sequelize.fn('sum', Sequelize.col('quantity')), 'totalQuantity'],
        [Sequelize.fn('sum', Sequelize.literal('quantity * price')), 'totalRevenue']
      ],
      include: [
        {
          model: Product,
          attributes: []
        },
        {
          model: Order,
          attributes: [],
          where: {
            status: { [Op.not]: 'cancelled' },
            createdAt: {
              [Op.gte]: getDateRange(period)
            }
          },
          required: true
        }
      ],
      group: ['productId', 'Product.name'],
      order: [[Sequelize.literal('totalQuantity'), 'DESC']],
      limit: parseInt(limit),
      raw: true
    });

    res.json({ success: true, data: productData });
  } catch (error) {
    console.error('Product analytics error:', error);
    res.status(500).json({ success: false, message: 'Error fetching product analytics' });
  }
};

// Helper function to get date range based on period
function getDateRange(period) {
  const now = new Date();
  switch (period) {
    case 'week':
      return new Date(now - 7 * 24 * 60 * 60 * 1000);
    case 'year':
      return new Date(now.getFullYear(), 0, 1);
    case 'month':
    default:
      return new Date(now.getFullYear(), now.getMonth(), 1);
  }
}

module.exports = {
  getSalesAnalytics,
  getProductAnalytics
};
