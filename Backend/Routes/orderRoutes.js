const express = require('express');
const router = express.Router();
const {
    placeOrderFromCart,
    getUserOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus
} = require('../controllers/orderController');

const { protectedUser, protectedAdmin } = require('../middleware/auth');

router.post('/orderFromCart', protectedUser, placeOrderFromCart);
router.get('/getMyOrders', protectedUser, getUserOrders);
router.get('/getMyOrder/:id', protectedUser, getOrderById);

// for admin 
router.get('/', protectedAdmin, getAllOrders);
router.put('/updateOrderStatus/:id', protectedAdmin, updateOrderStatus);

module.exports = router;
