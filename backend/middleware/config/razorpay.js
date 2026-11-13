const Razorpay = require('razorpay');

let razorpayInstance = null;

try {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_shopsphere12345',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'shopsphere_rzp_secret_67890',
  });
} catch (error) {
  console.warn('[Razorpay] Initialization warning:', error.message);
}

module.exports = razorpayInstance;
