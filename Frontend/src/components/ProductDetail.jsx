import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { syncAddToCart } from '../store';
import { Star, MessageCircle, ThumbsUp, Edit, Trash2, Send, ShoppingCart, AlertTriangle, Zap } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [myReview, setMyReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [quantity, setQuantity] = useState(1);
  
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:8000/api/product/getProductById/${id}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.product);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Error fetching product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      fetchReviews();
      fetchAverageRating();
      if (isLoggedIn) {
        fetchMyReview();
      }
    }
  }, [product, currentPage, isLoggedIn]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/review/product/${id}?page=${currentPage}&limit=5`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
        setTotalPages(data.pages);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const fetchAverageRating = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/review/product/${id}/average`);
      const data = await res.json();
      if (data.success) {
        setAverageRating(data.averageRating);
        setTotalReviews(data.totalReviews);
      }
    } catch (err) {
      console.error('Error fetching average rating:', err);
    }
  };

  const fetchMyReview = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/review/product/${id}/mine`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setMyReview(data.review);
        setReviewForm({ rating: data.review.rating, comment: data.review.comment });
      }
    } catch (err) {
      console.error('Error fetching my review:', err);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewForm.comment.trim()) {
      alert('Please add a comment to your review');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch(`http://localhost:8000/api/review/reviewProduct/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(reviewForm),
      });
      const data = await res.json();
      
      if (data.success) {
        setShowReviewForm(false);
        fetchReviews();
        fetchAverageRating();
        fetchMyReview();
        alert('Review submitted successfully!');
      } else {
        alert(data.message || 'Error submitting review');
      }
    } catch (err) {
      alert('Error submitting review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!confirm('Are you sure you want to delete your review?')) return;

    try {
      const res = await fetch(`http://localhost:8000/api/review/product/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      
      if (data.success) {
        setMyReview(null);
        setReviewForm({ rating: 5, comment: '' });
        fetchReviews();
        fetchAverageRating();
        alert('Review deleted successfully!');
      } else {
        alert(data.message || 'Error deleting review');
      }
    } catch (err) {
      alert('Error deleting review');
    }
  };

  const isLowStock = product?.quantityAvailable < 20;

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500 mx-auto mb-4"></div>
        <p className="text-emerald-600 font-semibold text-lg">Loading product details...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
      <div className="text-center">
        <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 font-semibold text-lg">{error}</p>
      </div>
    </div>
  );

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Product Details Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/50 overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="relative group">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-96 object-cover transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                
                {/* Low stock warning */}
                {isLowStock && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-pink-500 text-white px-4 py-2 rounded-full border-2 border-red-400 shadow-xl animate-pulse">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="font-bold text-sm">Only {product.quantityAvailable} left!</span>
                    </div>
                  </div>
                )}

                {/* Discount badge */}
                {product.discount > 0 && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold shadow-xl transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                    {product.discount}% OFF
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent mb-4">
                  {product.name}
                </h1>
                
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Category and Status */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full font-semibold capitalize">
                    {product.category}
                  </span>
                  <span className={`px-4 py-2 rounded-full font-semibold ${
                    product.isActive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Price Section */}
                <div className="mb-6">
                  {product.discount > 0 ? (
                    <div className="space-y-2">
                      {/* Original Price - Crossed Out */}
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-gray-400 line-through">
                          ₹{(product.pricePerUnit / (1 - product.discount / 100)).toFixed(2)}
                        </span>
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                          -{product.discount}%
                        </span>
                      </div>
                      {/* Discounted Price */}
                      <div className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                        ₹{product.pricePerUnit}
                      </div>
                      <div className="text-gray-500 font-medium">per {product.unit}</div>
                      <div className="text-sm text-green-600 font-semibold">
                        You save ₹{((product.pricePerUnit / (1 - product.discount / 100)) - product.pricePerUnit).toFixed(2)}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                        ₹{product.pricePerUnit}
                      </div>
                      <div className="text-gray-500 font-medium">per {product.unit}</div>
                    </div>
                  )}
                </div>

                {/* Stock Info - Only show when low stock */}
                {isLowStock && (
                  <div className="mb-6">
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-2xl border-2 border-red-200/50 shadow-lg">
                      <div className="text-center">
                        <div className="text-2xl font-black bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                          {product.quantityAvailable}
                        </div>
                        <div className="text-sm font-semibold text-red-600">Units Available</div>
                        <div className="mt-1 text-xs text-red-600 font-bold animate-pulse">
                          ⚠️ Low Stock Alert
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Compact Quantity Selector and Add to Cart */}
              <div className="space-y-4">
                {/* Compact Inline Quantity Selector */}
                <div className="bg-gradient-to-r from-emerald-50/80 to-green-50/80 backdrop-blur-lg p-4 rounded-2xl border-2 border-emerald-200/50 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-emerald-700">Quantity:</span>
                    
                    <div className="flex items-center gap-3">
                      {/* Decrease Button */}
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="group relative w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-emerald-300/50 overflow-hidden"
                      >
                        <span className="relative z-10">-</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                      </button>
                      
                      {/* Quantity Display */}
                      <div className="bg-white/90 backdrop-blur-sm border-2 border-emerald-300 rounded-xl px-4 py-2 min-w-[60px] shadow-lg">
                        <input
                          type="number"
                          min="1"
                          max={product.quantityAvailable}
                          value={quantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 1;
                            setQuantity(Math.max(1, Math.min(value, product.quantityAvailable)));
                          }}
                          className="w-full text-center text-lg font-bold text-emerald-700 bg-transparent border-none focus:outline-none"
                        />
                      </div>
                      
                      {/* Increase Button */}
                      <button
                        onClick={() => setQuantity(Math.min(product.quantityAvailable, quantity + 1))}
                        disabled={quantity >= product.quantityAvailable}
                        className="group relative w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-emerald-300/50 overflow-hidden"
                      >
                        <span className="relative z-10">+</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                      </button>
                    </div>
                  </div>
                  
                  {/* Compact Quantity Info */}
                  <div className="flex justify-between items-center mt-3 text-xs">
                    <span className="text-emerald-600 font-medium">
                      Max: {product.quantityAvailable} {product.unit}
                    </span>
                    <span className="text-gray-600">
                      Total: <span className="font-bold text-emerald-700">₹{(product.pricePerUnit * quantity).toLocaleString()}</span>
                    </span>
                  </div>
                </div>

                {/* Compact Add to Cart Button */}
                <button
                  className={`group relative w-full py-4 px-6 rounded-2xl font-bold text-lg shadow-[0_15px_35px_-5px_rgba(16,185,129,0.3)] transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-emerald-300/50 overflow-hidden border-2 ${
                    addedToCart
                      ? 'bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white border-green-400/80 shadow-[0_20px_40px_-5px_rgba(34,197,94,0.4)] animate-pulse'
                      : 'bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 hover:via-green-400 hover:to-emerald-500 text-white hover:shadow-[0_20px_45px_-5px_rgba(16,185,129,0.5)] border-emerald-400/80 hover:border-emerald-300'
                  }`}
                  onClick={() => {
                    // Add product with quantity to cart
                    const productWithQuantity = { ...product, quantity };
                    dispatch(syncAddToCart(productWithQuantity));
                    setAddedToCart(true);
                    setTimeout(() => setAddedToCart(false), 1500);
                  }}
                  disabled={addedToCart}
                >
                  <span className="relative z-20 flex items-center justify-center gap-3">
                    <ShoppingCart className={`w-6 h-6 transition-all duration-300 ${addedToCart ? 'animate-spin text-green-100' : 'group-hover:animate-bounce text-white'}`} />
                    <span className="tracking-wide font-black">
                      {addedToCart ? '✅ ADDED TO CART!' : `🛒 ADD ${quantity} TO CART`}
                    </span>
                    <Zap className={`w-5 h-5 transition-all duration-300 ${addedToCart ? 'opacity-100 animate-pulse text-yellow-300' : 'opacity-0 group-hover:opacity-100 group-hover:text-yellow-200'}`} />
                  </span>
                  
                  {/* Enhanced glow effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <div className="absolute inset-0 bg-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                  
                  {/* Holographic border */}
                  <div className="absolute inset-0 border-2 border-white/20 rounded-2xl group-hover:border-white/40 transition-colors duration-300"></div>
                  
                  {/* Pulsing energy core */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-green-400/20 to-emerald-400/10 animate-pulse rounded-2xl"></div>
                  
                  {/* Circuit-like details */}
                  <div className="absolute top-1 left-6 w-8 h-0.5 bg-emerald-300/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-1 right-6 w-8 h-0.5 bg-emerald-300/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </button>

                {/* Compact Low Stock Warning */}
                {isLowStock && (
                  <div className="p-3 bg-gradient-to-r from-red-50/90 to-pink-50/90 backdrop-blur-lg border-2 border-red-400/50 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                      <p className="text-xs text-red-700 font-bold tracking-wide">
                        ⚡ HURRY! Only {product.quantityAvailable} units left!
                      </p>
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/50 overflow-hidden">
          <div className="p-8">
            {/* Reviews Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className="flex items-center gap-2">
                  <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                  <span className="text-3xl font-black text-gray-800">{averageRating.toFixed(1)}</span>
                </div>
                <div className="text-gray-600">
                  <div className="font-semibold">{totalReviews} reviews</div>
                  <div className="text-sm">Based on verified purchases</div>
                </div>
              </div>

              {isLoggedIn && (
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all duration-200 flex items-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  {myReview ? 'Edit Review' : 'Write Review'}
                </button>
              )}
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl p-6 mb-8">
                <h3 className="text-xl font-bold text-emerald-700 mb-4">
                  {myReview ? 'Edit Your Review' : 'Write Your Review'}
                </h3>
                
                <div className="space-y-4">
                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className={`w-8 h-8 transition-all duration-200 ${
                            star <= reviewForm.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        >
                          <Star className="w-full h-full" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Comment</label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      placeholder="Share your experience with this product..."
                      className="w-full p-4 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none resize-none"
                      rows="4"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleSubmitReview}
                      disabled={submittingReview}
                      className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                    >
                      <Send className="w-5 h-5" />
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                    
                    {myReview && (
                      <button
                        onClick={handleDeleteReview}
                        className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all duration-200 flex items-center gap-2"
                      >
                        <Trash2 className="w-5 h-5" />
                        Delete Review
                      </button>
                    )}
                    
                    <button
                      onClick={() => setShowReviewForm(false)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review._id} className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {review.reviewer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{review.reviewer.name}</div>
                          <div className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {review.comment && (
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No reviews yet. Be the first to review this product!</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                      currentPage === i + 1
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 