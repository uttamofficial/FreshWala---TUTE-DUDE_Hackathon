const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['vegetables', 'fruits', 'spices', 'grains', 'dairy', 'beaverages', 'packaged', 'others'],
    index: true
  },
  pricePerUnit: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'l', 'ml', 'pcs', 'gm']
  },
  quantityAvailable: {
    type: Number,
    required: true,
    min: 0
  },
  imageUrl: {
    type: String,
    default: ''
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  totalSold: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
    timestamps : true
});

module.exports = mongoose.model("Product", productSchema);
