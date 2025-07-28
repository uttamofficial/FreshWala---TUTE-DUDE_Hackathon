const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Add or update item in cart
exports.addToCart = async (req, res) => {
    try {
        console.log('=== ADD TO CART STARTED ===');
        console.log('User ID:', req.user?._id);
        console.log('Request body:', req.body);
        
        const userId = req.user._id;
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        console.log('Product found:', product ? product.name : 'Not found');
        
        if (!product || !product.isActive) {
            console.log('Product not found or inactive');
            return res.status(404).json({ message: 'Product not found or inactive' });
        }

        if (quantity > product.quantityAvailable) {
            console.log('Quantity not available:', quantity, 'Available:', product.quantityAvailable);
            return res.status(400).json({ message: 'Requested quantity not available' });
        }

        let cart = await Cart.findOne({ user: userId });
        console.log('Existing cart found:', cart ? 'Yes' : 'No');

        const priceAtAddTime = product.pricePerUnit;
        const discountAtAddTime = product.discount || 0;
        console.log('Price at add time:', priceAtAddTime, 'Discount:', discountAtAddTime);

        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [{
                    product: productId,
                    quantity,
                    priceAtAddTime,
                    discountAtAddTime,
                }],
                totalPrice: priceAtAddTime * quantity - discountAtAddTime * quantity
            });
        } else {
            const index = cart.items.findIndex(item => item.product.toString() === productId);
            if (index > -1) {
                // Update quantity
                cart.items[index].quantity = quantity;
            } else {
                // Add new product
                cart.items.push({
                    product: productId,
                    quantity,
                    priceAtAddTime,
                    discountAtAddTime
                });
            }

            // Recalculate total price
            cart.totalPrice = cart.items.reduce((sum, item) => {
                const itemTotal = item.priceAtAddTime * item.quantity;
                const itemDiscount = item.discountAtAddTime * item.quantity;
                return sum + (itemTotal - itemDiscount);
            }, 0);
        }

        console.log('Saving cart with total price:', cart.totalPrice);
        await cart.save();
        console.log('=== ADD TO CART COMPLETED ===');
        res.status(200).json({ message: 'Item updated in cart', cart });
    } catch (err) {
        console.error('=== ADD TO CART FAILED ===');
        console.error('Add to cart error:', err);
        res.status(500).json({ message: 'Failed to add to cart' });
    }
};

// Get user's cart
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(200).json({ message: 'Cart is empty', cart: null });
        }
        res.status(200).json({ cart });
    } catch (err) {
        console.error('Get cart error:', err);
        res.status(500).json({ message: 'Failed to fetch cart' });
    }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        // Recalculate total
        cart.totalPrice = cart.items.reduce((sum, item) => {
            const itemTotal = item.priceAtAddTime * item.quantity;
            const itemDiscount = item.discountAtAddTime * item.quantity;
            return sum + (itemTotal - itemDiscount);
        }, 0);

        await cart.save();
        res.status(200).json({ message: 'Item removed from cart', cart });
    } catch (err) {
        console.error('Remove from cart error:', err);
        res.status(500).json({ message: 'Failed to remove item from cart' });
    }
};

// Clear entire cart
exports.clearCart = async (req, res) => {
    try {
        console.log('=== CLEAR CART STARTED ===');
        console.log('User ID:', req.user?._id);
        
        await Cart.findOneAndUpdate(
            { user: req.user._id },
            { items: [], totalPrice: 0 }
        );
        
        console.log('=== CLEAR CART COMPLETED ===');
        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (err) {
        console.error('=== CLEAR CART FAILED ===');
        console.error('Clear cart error:', err);
        res.status(500).json({ message: 'Failed to clear cart' });
    }
};
