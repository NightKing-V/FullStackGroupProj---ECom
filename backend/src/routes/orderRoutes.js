const express = require('express');
const router = express.Router();
const { createOrder, cancelOrder, listUserOrders } = require('../controllers/orderController');
const { authenticate, isAdmin } = require('../middlewares/authMiddleware');

// Create a order
router.post('/create',authenticate, createOrder);

// Cancel a order
router.post('/cancel',authenticate, cancelOrder);

// List all orders by user
router.get('/list',authenticate, listUserOrders);

module.exports = router;
