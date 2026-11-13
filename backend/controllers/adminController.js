const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get admin dashboard metrics & analytics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const lowStockProducts = await Product.countDocuments({ countInStock: { $lte: 5 } });

    // Calculate revenue
    const paidOrders = await Order.find({ isPaid: true });
    const totalRevenue = paidOrders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

    // Recent 6 orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(6);

    // Status breakdown
    const processingCount = await Order.countDocuments({ orderStatus: 'Processing' });
    const confirmedCount = await Order.countDocuments({ orderStatus: 'Confirmed' });
    const shippedCount = await Order.countDocuments({ orderStatus: 'Shipped' });
    const deliveredCount = await Order.countDocuments({ orderStatus: 'Delivered' });
    const cancelledCount = await Order.countDocuments({ orderStatus: 'Cancelled' });

    res.json({
      success: true,
      stats: {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        totalOrders,
        totalProducts,
        totalCustomers,
        lowStockProducts,
        statusBreakdown: {
          processing: processingCount,
          confirmed: confirmedCount,
          shipped: shippedCount,
          delivered: deliveredCount,
          cancelled: cancelledCount,
        },
      },
      recentOrders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders with pagination and status filtering
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 15;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.status && req.query.status !== 'All') {
      query.orderStatus = req.query.status;
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      orders,
      page,
      pages: Math.ceil(total / limit) || 1,
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const validStatuses = ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status' });
    }

    order.orderStatus = status;

    if (status === 'Delivered') {
      order.deliveredAt = new Date();
      if (order.paymentMethod === 'COD' && !order.isPaid) {
        order.isPaid = true;
        order.paidAt = new Date();
      }
    }

    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Order status updated to ${status} by administrator`,
    });

    const updatedOrder = await order.save();

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
};
