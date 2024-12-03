const express = require('express');
const router = express.Router();
const { createOrder, cancelOrder, listUserOrders, updateOrder, paymentCallback } = require('../controllers/orderController');
const { authenticate, isAdmin, validateAccessKey } = require('../middlewares/authMiddleware');

// Create a order
router.post('/create',authenticate, createOrder);

// Cancel a order
router.post('/cancel',authenticate, cancelOrder);

// List all orders by user
router.get('/list',authenticate, listUserOrders);

// Update a order status (Admin)
router.post('/update', authenticate, isAdmin, updateOrder);

// Callback for payment gateway
router.post('/payment-callback',validateAccessKey, paymentCallback)

module.exports = router;
