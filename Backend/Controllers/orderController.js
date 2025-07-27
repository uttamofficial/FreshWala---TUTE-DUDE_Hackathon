const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const User = require('../models/User');

exports.placeOrderFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const paymentMethod = req.body.paymentMethod || 'cash';

    // Fetch user's cart
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const user = await User.findById(userId);
    if (!user || !user.address) {
      return res.status(400).json({ message: 'User address not found' });
    }

    const validatedProducts = [];

    for (const item of cart.items) {
      const product = item.product;

      if (product.quantityAvailable < item.quantity) {
        return res.status(400).json({ message: `Out of stock: ${product.name}` });
      }

      validatedProducts.push({
        product: product._id,
        quantity: item.quantity,
        unitPrice: item.priceAtAddTime,
        discount: item.discountAtAddTime
      });
    }

    // Create and save order
    const order = new Order({
      customer: userId,
      products: validatedProducts,
      paymentMethod,
      deliveryAddress: user.address,
      paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid'
    });

    await order.save();

    // Update product stock
    for (const item of validatedProducts) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          quantityAvailable: -item.quantity,
          totalSold: item.quantity
        }
      });
    }

    // Clear cart
    await Cart.findOneAndDelete({ user: userId });

    res.status(201).json({
      message: 'Order placed successfully',
      order: {
        _id: order._id,
        products: order.products,
        totalPrice: order.totalPrice,
        discountApplied: order.discountApplied,
        finalPrice: order.finalPrice,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        status: order.status,
        deliveryAddress: order.deliveryAddress,
        createdAt: order.createdAt
      }
    });

  } catch (err) {
    console.error('Order Error:', err);
    res.status(500).json({ message: 'Order placement failed' });
  }
};

// Get all orders of logged-in user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).populate('products.product');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// Get specific order
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get order' });
  }
};

// Admin: Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('customer').populate('products.product');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// Admin: Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (status) {
      const validStatus = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatus.includes(status)) {
        return res.status(400).json({ message: 'Invalid order status' });
      }
      order.status = status;
    }

    if (paymentStatus) {
      const validPaymentStatus = ['pending', 'paid', 'failed'];
      if (!validPaymentStatus.includes(paymentStatus)) {
        return res.status(400).json({ message: 'Invalid payment status' });
      }
      order.paymentStatus = paymentStatus;
    }

    await order.save();
    res.status(200).json({ message: 'Order updated successfully', order });

  } catch (err) {
    console.error('Update Error:', err);
    res.status(500).json({ message: 'Failed to update order' });
  }
};

