const express = require('express');
const router = express.Router();
const { addToCart, removeFromCart, updateCartQuantity, listCartItems } = require('../controllers/cartController');
const { authenticate, isAdmin } = require('../middlewares/authMiddleware');

// Add product to cart
router.post('/add',authenticate, addToCart);

// Remove product from cart
router.post('/remove',authenticate, removeFromCart);

// Update product quantity in cart
router.post('/updateqty',authenticate, updateCartQuantity);

// List all items in the cart
router.get('/list',authenticate, listCartItems);

module.exports = router;
