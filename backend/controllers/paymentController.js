const crypto = require('crypto');
const Order = require('../models/Order');
const razorpayInstance = require('../config/razorpay');

// @desc    Create Razorpay Order
// @route   POST /api/payments/razorpay-order
// @access  Private
const createRazorpayOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized for this order payment' });
    }

    // Razorpay amount in smallest currency sub-unit (paise / cents)
    const amountInSubUnits = Math.round(order.totalPrice * 100);

    const options = {
      amount: amountInSubUnits,
      currency: 'INR',
      receipt: `order_rcptid_${order._id}`,
    };

    let razorpayOrder;

    if (razorpayInstance && process.env.RAZORPAY_KEY_SECRET !== 'shopsphere_rzp_secret_67890') {
      // Real Razorpay API call
      razorpayOrder = await razorpayInstance.orders.create(options);
    } else {
      // Test sandbox mode fallback
      razorpayOrder = {
        id: `order_rzp_${Date.now()}_test`,
        entity: 'order',
        amount: amountInSubUnits,
        currency: 'INR',
        receipt: options.receipt,
        status: 'created',
      };
    }

    res.json({
      success: true,
      razorpayOrder,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_shopsphere12345',
      orderId: order._id,
      amount: order.totalPrice,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay payment signature & mark order paid
// @route   POST /api/payments/razorpay-verify
// @access  Private
const verifyRazorpayPayment = async (req, res, next) => {
  try {
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || 'shopsphere_rzp_secret_67890';
    let isValid = false;

    if (secret !== 'shopsphere_rzp_secret_67890') {
      // Standard HMAC SHA256 signature verification
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body.toString())
        .digest('hex');

      isValid = expectedSignature === razorpay_signature;
    } else {
      // Test mode verification
      isValid = true;
    }

    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature verification' });
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentMethod = 'Razorpay';
    order.paymentResult = {
      id: razorpay_payment_id || `pay_test_${Date.now()}`,
      status: 'Captured',
      update_time: new Date().toISOString(),
      email_address: req.user.email,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    };

    order.statusHistory.push({
      status: 'Confirmed',
      timestamp: new Date(),
      note: `Payment verified via Razorpay (${razorpay_payment_id || 'test_mode'})`,
    });

    order.orderStatus = 'Confirmed';
    const updatedOrder = await order.save();

    res.json({
      success: true,
      message: 'Payment verified and order confirmed successfully',
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
};
