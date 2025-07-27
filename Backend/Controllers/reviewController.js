const mongoose = require("mongoose");
const ReviewProduct = require("../models/ReviewProduct");
const ReviewSupplier = require("../models/ReviewSupplier");
const Order = require("../models/Order");
const Product = require("../models/Product");

// Pagination helper
const getPagination = (req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

// 🔒 Check if user has ordered product
const hasOrderedProduct = async (userId, productId) => {
  const order = await Order.findOne({
    customer: userId,
    "products.product": productId,
  });
  return !!order;
};

// 🔒 Check if user has ordered from seller
const hasOrderedFromSeller = async (userId, sellerId) => {
  const orders = await Order.find({ customer: userId }).populate("products.product");
  return orders.some((order) =>
    order.products.some((p) => p.product?.supplier?.toString() === sellerId)
  );
};

// 1. Create or update product review
exports.reviewProduct = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;
  const { rating, comment } = req.body;

  if (!rating) {
    return res.status(400).json({ success: false, message: "Rating is required." });
  }

  try {
    const isEligible = await hasOrderedProduct(userId, productId);
    if (!isEligible) {
      return res.status(403).json({ success: false, message: "You can only review products you have ordered." });
    }

    const existing = await ReviewProduct.findOne({ product: productId, reviewer: userId });

    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
      await existing.save();
      return res.status(200).json({ success: true, message: "Review updated." });
    }

    const newReview = new ReviewProduct({ product: productId, reviewer: userId, rating, comment });
    await newReview.save();
    res.status(201).json({ success: true, message: "Review submitted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// 3. Get product reviews (paginated)
exports.getProductReviews = async (req, res) => {
  const { productId } = req.params;
  const { page, limit, skip } = getPagination(req);
  
  try {
    const total = await ReviewProduct.countDocuments({ product: productId });
    const reviews = await ReviewProduct.find({ product: productId })
    .populate("reviewer", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
    
    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      reviews,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// 5. Get user's product review
exports.getMyProductReview = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;
  
  try {
    const review = await ReviewProduct.findOne({ product: productId, reviewer: userId });
    
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found." });
    }
    
    res.status(200).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



// 7. Delete product review
exports.deleteProductReview = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;
  
  try {
    const result = await ReviewProduct.findOneAndDelete({ product: productId, reviewer: userId });
    
    if (!result) {
      return res.status(404).json({ success: false, message: "Review not found." });
    }
    
    res.status(200).json({ success: true, message: "Review deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// 9. Get product average rating
exports.getProductAverageRating = async (req, res) => {
  const { productId } = req.params;
  
  try {
    const result = await ReviewProduct.aggregate([
      { $match: { product: mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: "$product",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);
    
    if (!result.length) {
      return res.status(200).json({ success: true, averageRating: 0, totalReviews: 0 });
    }
    
    res.status(200).json({
      success: true,
      averageRating: result[0].averageRating,
      totalReviews: result[0].totalReviews,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 10. Get seller average rating
exports.getSellerAverageRating = async (req, res) => {
  const { sellerId } = req.params;
  
  try {
    const result = await ReviewSupplier.aggregate([
      { $match: { supplier: mongoose.Types.ObjectId(sellerId) } },
      {
        $group: {
          _id: "$supplier",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);
    
    if (!result.length) {
      return res.status(200).json({ success: true, averageRating: 0, totalReviews: 0 });
    }
    
    res.status(200).json({
      success: true,
      averageRating: result[0].averageRating,
      totalReviews: result[0].totalReviews,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. Create or update seller review
exports.reviewSeller = async (req, res) => {
  const userId = req.user.id;
  const { sellerId } = req.params;
  const { rating, comment } = req.body;
  
  if (!rating) {
    return res.status(400).json({ success: false, message: "Rating is required." });
  }
  
  try {
    const isEligible = await hasOrderedFromSeller(userId, sellerId);
    if (!isEligible) {
      return res.status(403).json({ success: false, message: "You can only review sellers you have ordered from." });
    }
    
    const existing = await ReviewSupplier.findOne({ supplier: sellerId, reviewer: userId });
    
    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
      await existing.save();
      return res.status(200).json({ success: true, message: "Review updated." });
    }
    
    const newReview = new ReviewSupplier({ supplier: sellerId, reviewer: userId, rating, comment });
    await newReview.save();
    res.status(201).json({ success: true, message: "Review submitted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// 8. Delete seller review
exports.deleteSellerReview = async (req, res) => {
  const userId = req.user.id;
  const { sellerId } = req.params;
  
  try {
    const result = await ReviewSupplier.findOneAndDelete({ supplier: sellerId, reviewer: userId });
    
    if (!result) {
      return res.status(404).json({ success: false, message: "Review not found." });
    }
    
    res.status(200).json({ success: true, message: "Review deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// 6. Get user's seller review
exports.getMySellerReview = async (req, res) => {
  const userId = req.user.id;
  const { sellerId } = req.params;
  
  try {
    const review = await ReviewSupplier.findOne({ supplier: sellerId, reviewer: userId });
    
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found." });
    }
    
    res.status(200).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 4. Get seller reviews (paginated)
exports.getSellerReviews = async (req, res) => {
  const { sellerId } = req.params;
  const { page, limit, skip } = getPagination(req);
  
  try {
    const total = await ReviewSupplier.countDocuments({ supplier: sellerId });
    const reviews = await ReviewSupplier.find({ supplier: sellerId })
    .populate("reviewer", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
    
    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      reviews,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
