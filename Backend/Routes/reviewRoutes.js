const express = require("express");
const { reviewProduct, reviewSeller, getProductReviews, getMyProductReview, deleteProductReview, getProductAverageRating, getSellerReviews, getMySellerReview, deleteSellerReview, getSellerAverageRating } = require("../Controllers/reviewController");
const { protectedUser } = require("../middleware/auth");
const router = express.Router();

router.post("/reviewProduct/:productId", protectedUser, reviewProduct);
router.get("/product/:productId", getProductReviews);
router.get("/product/:productId/mine", protectedUser, getMyProductReview);
router.delete("/product/:productId", protectedUser, deleteProductReview);
router.get("/product/:productId/average", getProductAverageRating);

// router.post("/reviewSeller/:sellerId", protectedUser, reviewSeller);
// router.get("/seller/:sellerId", getSellerReviews);
// router.get("/seller/:sellerId/mine", protectedUser, getMySellerReview);
// router.delete("/seller/:sellerId", protectedUser, deleteSellerReview);
// router.get("/seller/:sellerId/average", getSellerAverageRating);


module.exports = router;