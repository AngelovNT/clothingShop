const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Protected routes
router.post('/', protect, createOrder);
router.get('/', protect, admin, getOrders);
router.get('/myorders', protect, getUserOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.put('/:id/payment', protect, admin, updatePaymentStatus);

module.exports = router; 