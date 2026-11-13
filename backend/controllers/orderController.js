const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items specified' });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode) {
      return res.status(400).json({ success: false, message: 'Please provide a complete shipping address' });
    }

    // Verify stock availability & decrement inventory
    const finalOrderItems = [];
    let itemsPrice = 0;

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.name} not found` });
      }

      if (product.countInStock < item.qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Only ${product.countInStock} available`,
        });
      }

      // Decrement inventory
      product.countInStock -= item.qty;
      await product.save();

      const itemTotal = product.price * item.qty;
      itemsPrice += itemTotal;

      finalOrderItems.push({
        name: product.name,
        qty: item.qty,
        image: product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
        price: product.price,
        product: product._id,
      });
    }

    const shippingPrice = itemsPrice > 50 ? 0 : 9.99;
    const taxPrice = Number((itemsPrice * 0.08).toFixed(2));
    const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

    const order = await Order.create({
      user: req.user._id,
      orderItems: finalOrderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      itemsPrice: Number(itemsPrice.toFixed(2)),
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: false,
      orderStatus: 'Processing',
      statusHistory: [
        {
          status: 'Processing',
          timestamp: new Date(),
          note: 'Order placed successfully and queued for processing.',
        },
      ],
    });

    // Clear user's cart after order creation
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('orderItems.product', 'name images brand slug');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Only allow customer who placed order or admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied to this order' });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order (if still in Processing or Confirmed status)
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this order' });
    }

    if (!['Processing', 'Confirmed'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled in '${order.orderStatus}' status`,
      });
    }

    order.orderStatus = 'Cancelled';
    order.statusHistory.push({
      status: 'Cancelled',
      timestamp: new Date(),
      note: req.body.reason || 'Cancelled by customer',
    });

    // Restore product inventory
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { countInStock: item.qty },
      });
    }

    const updatedOrder = await order.save();

    res.json({
      success: true,
      message: 'Order cancelled and stock restored successfully',
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
};
