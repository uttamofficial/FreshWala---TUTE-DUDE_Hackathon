const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
            unitPrice: {
                type: Number,
                required: true,
                min: 0,
            },
            discount: {
                type: Number, // per unit discount in ₹
                default: 0,
                min: 0,
            },
        },
    ],
    totalPrice: {
        type: Number,
        min: 0,
    },
    discountApplied: {
        type: Number,
        min: 0,
    },
    finalPrice: {
        type: Number,
        min: 0,
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },
    deliveryAddress: {
        type: String, // auto-filled from User model
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'upi'],
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending',
    },
}, {
    timestamps: true,
});

orderSchema.pre('save', function (next) {
    let total = 0;
    let discount = 0;

    this.products.forEach((item) => {
        const itemTotal = item.unitPrice * item.quantity;
        const itemDiscount = (item.discount || 0) * item.quantity;

        total += itemTotal;
        discount += itemDiscount;
    });

    this.totalPrice = total;
    this.discountApplied = discount;
    this.finalPrice = total - discount;

    next();
});


module.exports = mongoose.model('Order', orderSchema);