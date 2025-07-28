const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const User = require('../models/User');

exports.placeOrderFromCart = async (req, res) => {
  try {
    console.log('=== ORDER PLACEMENT STARTED ===');
    console.log('User ID:', req.user?._id);
    console.log('Request body:', req.body);
    
    const userId = req.user._id;
    const paymentMethod = req.body.paymentMethod || 'cash';

    console.log('Payment method:', paymentMethod);

    // Fetch user's cart
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    console.log('Cart found:', cart ? 'Yes' : 'No');
    console.log('Cart items count:', cart?.items?.length || 0);
    
    if (!cart || cart.items.length === 0) {
      console.log('Cart is empty, returning error');
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const user = await User.findById(userId);
    console.log('User found:', user ? 'Yes' : 'No');
    console.log('User name:', user?.name);
    
    if (!user) {
      console.log('User not found, returning error');
      return res.status(400).json({ message: 'User not found' });
    }

    // Use provided address or user's address or a default
    const deliveryAddress = req.body.deliveryAddress || user.address || 'Address to be updated';
    console.log('Delivery address:', deliveryAddress);

    const validatedProducts = [];

    for (const item of cart.items) {
      const product = item.product;
      console.log('Processing product:', product?.name, 'Available:', product?.quantityAvailable, 'Requested:', item.quantity);

      if (product.quantityAvailable < item.quantity) {
        console.log('Out of stock for product:', product.name);
        return res.status(400).json({ message: `Out of stock: ${product.name}` });
      }

      validatedProducts.push({
        product: product._id,
        quantity: item.quantity,
        unitPrice: item.priceAtAddTime,
        discount: item.discountAtAddTime
      });
    }

    console.log('Validated products:', validatedProducts.length);

    // Create and save order
    const order = new Order({
      customer: userId,
      products: validatedProducts,
      paymentMethod,
      deliveryAddress: deliveryAddress,
      paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid'
    });

    console.log('Order object created, saving...');
    await order.save();
    console.log('Order saved successfully with ID:', order._id);

    // Update product stock
    console.log('Updating product stock...');
    for (const item of validatedProducts) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          quantityAvailable: -item.quantity,
          totalSold: item.quantity
        }
      });
    }
    console.log('Product stock updated');

    // Clear cart
    console.log('Clearing cart...');
    await Cart.findOneAndDelete({ user: userId });
    console.log('Cart cleared');

    console.log('=== ORDER PLACEMENT COMPLETED SUCCESSFULLY ===');
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
    console.error('=== ORDER PLACEMENT FAILED ===');
    console.error('Error details:', err);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    res.status(500).json({ message: 'Order placement failed' });
  }
};

// Alternative order placement that accepts cart data directly
exports.placeOrderDirect = async (req, res) => {
  try {
    console.log('=== DIRECT ORDER PLACEMENT STARTED ===');
    console.log('User ID:', req.user?._id);
    console.log('Request body:', req.body);
    
    const userId = req.user._id;
    const { paymentMethod = 'cash', cartItems } = req.body;

    console.log('Payment method:', paymentMethod);
    console.log('Cart items:', cartItems);

    if (!cartItems || cartItems.length === 0) {
      console.log('No cart items provided');
      return res.status(400).json({ message: 'No items provided for order' });
    }

    const user = await User.findById(userId);
    console.log('User found:', user ? 'Yes' : 'No');
    console.log('User name:', user?.name);
    
    if (!user) {
      console.log('User not found, returning error');
      return res.status(400).json({ message: 'User not found' });
    }

    // Use provided address or user's address or a default
    const deliveryAddress = req.body.deliveryAddress || user.address || 'Address to be updated';
    console.log('Delivery address:', deliveryAddress);

    const validatedProducts = [];

    for (const item of cartItems) {
      const product = await Product.findById(item._id);
      console.log('Processing product:', product?.name, 'Available:', product?.quantityAvailable, 'Requested:', item.quantity);

      if (!product || !product.isActive) {
        console.log('Product not found or inactive:', item.name);
        return res.status(400).json({ message: `Product not found: ${item.name}` });
      }

      if (product.quantityAvailable < (item.quantity || 1)) {
        console.log('Out of stock for product:', product.name);
        return res.status(400).json({ message: `Out of stock: ${product.name}` });
      }

      validatedProducts.push({
        product: product._id,
        quantity: item.quantity || 1,
        unitPrice: product.pricePerUnit,
        discount: product.discount || 0
      });
    }

    console.log('Validated products:', validatedProducts.length);

    // Create and save order
    const order = new Order({
      customer: userId,
      products: validatedProducts,
      paymentMethod,
      deliveryAddress: deliveryAddress,
      paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid'
    });

    console.log('Order object created, saving...');
    await order.save();
    console.log('Order saved successfully with ID:', order._id);

    // Update product stock
    console.log('Updating product stock...');
    for (const item of validatedProducts) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          quantityAvailable: -item.quantity,
          totalSold: item.quantity
        }
      });
    }
    console.log('Product stock updated');

    console.log('=== DIRECT ORDER PLACEMENT COMPLETED SUCCESSFULLY ===');
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
    console.error('=== DIRECT ORDER PLACEMENT FAILED ===');
    console.error('Error details:', err);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    res.status(500).json({ message: 'Direct order placement failed' });
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

