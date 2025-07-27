// src/components/FeaturedProducts.jsx
import React from 'react';
import { Star, Heart, ShoppingCart, Truck, Award, TrendingUp, Clock } from 'lucide-react';

const FeaturedProducts = () => {
  // Helper for Indian price formatting
  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount);
  };

  // INR prices for demo
  const products = [
    {
      name: "Premium Tomatoes",
      price: 49,
      originalPrice: 65,
      image: "https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2",
      rating: 4.8,
      supplier: "Fresh Farm Co.",
      discount: "25% OFF",
      badge: "Bestseller",
      inStock: true,
      fastDelivery: true,
      organic: true
    },
    {
      name: "Organic Onions",
      price: 89,
      originalPrice: 120,
      image: "https://images.pexels.com/photos/533342/pexels-photo-533342.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2",
      rating: 4.9,
      supplier: "Green Valley",
      discount: "26% OFF",
      badge: "Premium",
      inStock: true,
      fastDelivery: true,
      organic: true
    },
    {
      name: "Fresh Spinach",
      price: 65,
      originalPrice: 85,
      image: "https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2",
      rating: 4.7,
      supplier: "Leafy Greens Co.",
      discount: "24% OFF",
      badge: "Farm Fresh",
      inStock: true,
      fastDelivery: false,
      organic: true
    },
    {
      name: "Organic Milk",
      price: 120,
      originalPrice: 150,
      image: "https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2",
      rating: 4.9,
      supplier: "Pure Dairy",
      discount: "20% OFF",
      badge: "Pure & Fresh",
      inStock: true,
      fastDelivery: true,
      organic: false
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-40 h-40 bg-green-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-20 w-32 h-32 bg-emerald-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-teal-200/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg">
            <TrendingUp className="w-4 h-4" />
            Hot Deals & Featured Products
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-gray-900 via-green-700 to-emerald-600 bg-clip-text text-transparent mb-6 leading-relaxed pb-2">
            Featured Products & Special Offers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Handpicked ingredients at unbeatable prices. 
            <span className="text-green-600 font-semibold"> Fresh from farm to your doorstep!</span>
          </p>
          
          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-gray-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
              <Truck className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Free Delivery ₹500+</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
              <Award className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Quality Guaranteed</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
              <Clock className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Same Day Delivery</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-emerald-300/40 hover:scale-105 border border-white/50 hover:border-green-400/60 group relative transform hover:-translate-y-2"
              style={{ boxShadow: '0 8px 40px 0 rgba(31, 38, 135, 0.15)' }}
            >
              {/* Wishlist button */}
              <button className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-red-50 hover:scale-110 group-hover:opacity-100 opacity-70">
                <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors duration-300" />
              </button>

              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover transition-all duration-500 group-hover:scale-110"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Multiple badges */}
                <div className="absolute top-4 left-4 space-y-2">
                  <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg animate-pulse">
                    {product.discount}
                  </span>
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg">
                    {product.badge}
                  </div>
                </div>

                {/* Status indicators */}
                <div className="absolute bottom-4 left-4 flex gap-2">
                  {product.organic && (
                    <span className="bg-green-500 text-white px-2 py-1 text-xs font-semibold rounded-full">
                      Organic
                    </span>
                  )}
                  {product.fastDelivery && (
                    <span className="bg-orange-500 text-white px-2 py-1 text-xs font-semibold rounded-full flex items-center gap-1">
                      <Truck className="w-3 h-3" />
                      Fast
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-900 mb-1 tracking-tight group-hover:text-emerald-600 transition-colors duration-300">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">by {product.supplier}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-400' : 'bg-red-400'} shadow-lg`}></div>
                </div>

                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2 font-medium">({product.rating})</span>
                  <span className="text-xs text-gray-500 ml-2">• 127 reviews</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-emerald-600">{formatINR(product.price)}</span>
                      <span className="text-sm text-gray-400 line-through">{formatINR(product.originalPrice)}</span>
                    </div>
                    <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full">
                      Save ₹{product.originalPrice - product.price}
                    </span>
                  </div>

                  {/* Progress bar for stock */}
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" style={{width: '70%'}}></div>
                  </div>
                  <p className="text-xs text-gray-500">Only few left in stock</p>

                  <div className="flex gap-2 pt-2">
                    <button className="flex-1 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 text-white py-3 px-4 rounded-2xl text-sm font-bold shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-200 flex items-center justify-center gap-2 group-hover:shadow-2xl hover:shadow-emerald-300/50 transform hover:scale-105 relative overflow-hidden">
                      <ShoppingCart className="w-4 h-4 transition-transform group-hover:rotate-12" />
                      <span className="relative z-10">Add to Cart</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-500"></div>
                    </button>
                    <button className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-50 hover:to-blue-100 text-gray-700 hover:text-blue-700 py-3 px-4 rounded-2xl text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 shadow-lg hover:shadow-xl transform hover:scale-105 border border-gray-200 hover:border-blue-300 relative overflow-hidden group">
                      <span className="relative z-10">Quick View</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"></div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-700/20"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">🎉 Special Launch Offer!</h3>
              <p className="text-green-100 mb-6 text-lg">Get extra 15% off on your first order above ₹1000. Use code: <span className="font-bold text-yellow-300">FRESH15</span></p>
              <div className="flex justify-center gap-4">
                <button className="bg-white text-green-600 font-bold py-3 px-8 rounded-2xl text-lg shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50">
                  Shop Now
                </button>
                <button className="border-2 border-white text-white font-bold py-3 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 hover:bg-white hover:text-green-600 focus:outline-none focus:ring-4 focus:ring-white/50">
                  View All Products
                </button>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
