const { Order, OrderItem, Product, User } = require('../models');
const { getIO } = require('../socket');
const { sequelize } = require('../config/database');
const emailService = require('../utils/emailService');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (Customer)
const createOrder = async (req, res) => {
  const { items, promotionCode, deliveryAddress, customerNotes } = req.body;
  const customerId = req.user.id;

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Your cart is empty.' });
  }

  const transaction = await sequelize.transaction();

  try {
    const productIds = items.map(item => item.id);
    const productsInDb = await Product.findAll({ where: { id: productIds } }, { transaction });

    if (productsInDb.length !== productIds.length) {
      return res.status(404).json({ success: false, message: 'One or more products in your cart could not be found.' });
    }

    const productMap = new Map(productsInDb.map(p => [p.id, p]));
    let subtotal = 0;
    const orderItems = items.map(item => {
      const product = productMap.get(item.id);
      subtotal += product.price * item.quantity;
      return { ...item, price: product.price }; // Use server-side price
    });

    let promotionId = null;
    let discountAmount = 0;

    if (promotionCode) {
      const promotion = await Promotion.findOne({ 
        where: { code: promotionCode, isActive: true } 
      }, { transaction });

      if (promotion) {
        promotionId = promotion.id;
        if (promotion.discountType === 'percentage') {
          discountAmount = subtotal * (promotion.amount / 100);
        } else {
          discountAmount = promotion.amount;
        }
      }
    }

    const totalAmount = Math.max(0, subtotal - discountAmount);

    const newOrder = await Order.create({
      customerId,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      customerNotes,
      promotionId,
      // Default statuses are set in the model
    }, { transaction });

    await transaction.commit();

    // Send order confirmation email
    try {
      const customer = await User.findByPk(customerId);
      if (customer) {
        // Ensure order data is plain for the email template
        const orderDataForEmail = {
          ...newOrder.get({ plain: true }),
          items: newOrder.items, 
        };
        await emailService.sendOrderConfirmationEmail(customer, orderDataForEmail);
      }
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
      // Do not fail the request if email sending fails. The order is already created.
    }

        // Notify staff room of the new order
    const io = getIO();
    io.to('staff_room').emit('new_order', newOrder);

    res.status(201).json({ success: true, data: newOrder });

  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ success: false, message: 'Failed to create order.', error: error.message });
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/my-orders
// @access  Private (Customer)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ 
      where: { customerId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private (Customer, Staff, Admin)
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, { include: ['customer', 'promotion'] });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Ensure customer can only see their own orders
    if (req.user.role === 'customer' && order.customerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};


// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin/Staff
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: { model: User, attributes: ['id', 'name', 'email'] },
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin/Staff
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Cancel an order by customer
// @route   PUT /api/orders/:orderId/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check if the user owns the order
    if (order.customerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'User not authorized to cancel this order' });
    }

    // Check if the order is in a state that can be cancelled
    if (order.status !== 'Pending') {
      return res.status(400).json({ success: false, message: `Order cannot be cancelled. Status: ${order.status}` });
    }

    order.status = 'Cancelled';
    await order.save();

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Initiate order modification by cancelling and returning items
// @route   PUT /api/orders/:orderId/modify
// @access  Private
const initiateOrderModification = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByPk(orderId, {
      include: [{ model: OrderItem, include: [Product] }]
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'User not authorized to modify this order' });
    }

    if (order.status !== 'Pending') {
      return res.status(400).json({ success: false, message: `Order cannot be modified. Status: ${order.status}` });
    }

    // For simplicity, we cancel the order. A real-world scenario would involve payment gateway refunds.
    order.status = 'Cancelled';
    await order.save();

    // Return the items so the frontend can repopulate the cart
    res.status(200).json({ success: true, data: order.OrderItems });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  initiateOrderModification,
};
