const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderStats,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.route('/').post(createOrder);

// Temporarily make these routes public for testing
router.route('/').get(getOrders);
router.route('/stats').get(getOrderStats);
router.route('/:id').get(getOrderById).put(updateOrder).delete(deleteOrder);
router.route('/:id/status').patch(updateOrderStatus);

// Uncomment the lines below when Firebase is properly configured
// Protected routes
// router.route('/').get(protect, getOrders);
// router.route('/stats').get(protect, getOrderStats);
// router.route('/:id').get(protect, getOrderById).put(protect, updateOrder).delete(protect, deleteOrder);
// router.route('/:id/status').patch(protect, updateOrderStatus);

module.exports = router;