const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, isAdmin } = require('../middlewares/authMiddleware');

// Protected routes (requires authentication)
router.get('/:id', authenticate, userController.getUserById);
router.get('/', authenticate, isAdmin, userController.getAllUsers);
router.put('/:id', authenticate, userController.updateUser);
router.delete('/:id', authenticate, userController.deleteUser);

module.exports = router;
