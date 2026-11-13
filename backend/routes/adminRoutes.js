const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

// All routes here require both authentication & admin role
router.use(protect, admin);

router.get('/dashboard', getDashboardStats);
router.get('/orders', getAllOrders);
router.put('/orders/:id', updateOrderStatus);
router.get('/users', getAllUsers);

module.exports = router;
