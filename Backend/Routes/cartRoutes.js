const express = require('express');
const router = express.Router();
const { protectedUser } = require('../middleware/auth');
const {
  addToCart,
  getCart,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');

// Add/update cart
router.post('/addToCart', protectedUser, addToCart);

// Get cart
router.get('/getMyCart', protectedUser, getCart);

// Remove a product
router.delete('/:productId', protectedUser, removeFromCart);

// Clear entire cart
router.delete('/clearMyCart', protectedUser, clearCart);

module.exports = router;
