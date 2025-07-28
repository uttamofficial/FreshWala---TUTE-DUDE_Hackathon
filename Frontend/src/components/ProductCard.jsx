import React, { useState } from 'react';
import { ShoppingCart, AlertTriangle, Zap, Star } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { syncAddToCart } from '../store';

const ProductCard = ({ product }) => {
  const isLowStock = product.quantityAvailable < 20;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent navigation when clicking add to cart
    dispatch(syncAddToCart(product));
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleProductClick = () => {
    // Scroll to top of the page
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    
    // Navigate to product detail page
    navigate(`/product/${product._id}`);
  };

  return (
    <div 
      className="group relative w-full max-w-xs min-h-[420px] h-[420px] mx-auto bg-gradient-to-br from-white/95 via-emerald-50/80 to-cyan-50/60 backdrop-blur-3xl rounded-3xl shadow-[0_20px_50px_-12px_rgba(16,185,129,0.25)] border border-emerald-400/30 overflow-hidden hover:shadow-[0_25px_60px_-12px_rgba(16,185,129,0.4)] hover:shadow-emerald-500/40 hover:-translate-y-4 hover:scale-105 transition-all duration-700 hover:border-emerald-400/80 flex flex-col cursor-pointer"
      onClick={handleProductClick}
      title={`Click to view ${product.name} details`}
    >
      {/* Futuristic animated grid overlay */}
      <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[length:20px_20px] animate-pulse"></div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24%,rgba(16,185,129,0.05)_25%,rgba(16,185,129,0.05)_26%,transparent_27%,transparent_74%,rgba(16,185,129,0.05)_75%,rgba(16,185,129,0.05)_76%,transparent_77%)]"></div>
      </div>
      
      {/* Holographic border effect */}
      <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-emerald-400/30 via-cyan-400/30 to-emerald-400/30 bg-clip-border opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Scanning line effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent transform -translate-y-full group-hover:translate-y-full transition-transform duration-2000 ease-linear"></div>
      </div>

      {/* Enhanced low stock warning banner */}
      {isLowStock && (
        <div className="absolute top-3 left-3 right-3 z-30 bg-gradient-to-r from-red-500/95 via-pink-500/95 to-red-400/95 backdrop-blur-xl text-white px-4 py-3 rounded-2xl border border-red-400/50 shadow-[0_8px_32px_-8px_rgba(239,68,68,0.4)] animate-pulse">
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4 animate-bounce text-yellow-300" />
            <span className="text-xs font-bold tracking-wide">⚡ Only {product.quantityAvailable} left!</span>
          </div>
          {/* Pulsing border */}
          <div className="absolute inset-0 rounded-2xl border border-red-300/50 animate-pulse"></div>
        </div>
      )}

      {/* Enhanced discount badge */}
      {product.discount > 0 && (
        <div className="absolute top-3 right-3 z-30 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 text-black px-4 py-2 rounded-full text-xs font-black shadow-[0_8px_25px_-8px_rgba(251,191,36,0.6)] transform rotate-12 group-hover:rotate-6 group-hover:scale-110 transition-all duration-500">
          <div className="flex items-center gap-1">
            <span>💥</span>
            <span>{product.discount}% OFF</span>
          </div>
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-yellow-400/30 blur-md animate-pulse -z-10"></div>
        </div>
      )}

      {/* Enhanced image section with holographic effects */}
      <div className="relative overflow-hidden rounded-t-3xl h-56 min-h-[224px] max-h-[224px] bg-gradient-to-br from-emerald-900/10 to-cyan-900/10">
        <img
          className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:brightness-110"
          src={product.imageUrl}
          alt={product.name}
        />
        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-emerald-900/20 to-transparent rounded-t-3xl" />
        
        {/* Enhanced View Details overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-emerald-800/70 to-cyan-900/80 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center rounded-t-3xl">
          <div className="text-white text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/30">
              <div className="text-2xl mb-2">👁️</div>
              <div className="text-lg font-bold mb-2">View Product Details</div>
              <div className="text-sm opacity-90 mb-3">Click anywhere on this card</div>
              <div className="text-xs opacity-70">See reviews, full description & more</div>
            </div>
          </div>
        </div>
        
        {/* Holographic shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1500 ease-out"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-cyan-400/10 to-transparent transform skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-2000 ease-out"></div>
        
        {/* Floating category badge with enhanced design */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-lg text-emerald-700 px-4 py-2 rounded-full text-xs font-bold shadow-[0_8px_32px_-8px_rgba(16,185,129,0.3)] capitalize border border-emerald-200/50 group-hover:scale-105 transition-all duration-300">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            {product.category}
          </div>
        </div>
        
        {/* Corner accent lights */}
        <div className="absolute top-2 right-2 w-3 h-3 bg-emerald-400/60 rounded-full blur-sm animate-pulse"></div>
        <div className="absolute top-2 left-2 w-2 h-2 bg-cyan-400/60 rounded-full blur-sm animate-pulse delay-300"></div>
        
        {/* Click indicator */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-lg text-emerald-700 px-3 py-1 rounded-full text-xs font-bold shadow-lg border border-emerald-200/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          👁️ Click to View
        </div>
      </div>

      {/* Enhanced content section */}
      <div className="flex-1 flex flex-col justify-between p-6 relative z-10 min-h-[196px] bg-gradient-to-b from-transparent to-white/50">
        <div>
          <h3 className="text-2xl font-black text-transparent bg-gradient-to-r from-emerald-700 via-emerald-600 to-cyan-600 bg-clip-text mb-2 group-hover:from-emerald-500 group-hover:via-emerald-400 group-hover:to-cyan-500 tracking-tight drop-shadow-2xl transition-all duration-500">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600/90 mb-4 line-clamp-2 leading-relaxed font-medium">
            {product.description}
          </p>
        </div>

        {/* Enhanced price section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col relative">
            <span className="text-3xl font-black bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-700 bg-clip-text text-transparent drop-shadow-lg">
              ₹{product.pricePerUnit}
            </span>
            <span className="text-xs text-gray-500 font-semibold">per {product.unit}</span>
            {/* Price glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-green-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
          </div>
          {/* Enhanced stock indicator */}
          {isLowStock && (
            <div className="px-3 py-2 rounded-2xl text-xs font-bold bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border-2 border-red-400/50 animate-pulse shadow-lg">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                {product.quantityAvailable} left
              </div>
            </div>
          )}
        </div>

        {/* Enhanced rating stars */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-lg transition-all duration-300 group-hover:scale-110" />
          ))}
          <span className="text-xs text-gray-500 ml-2 font-semibold">(4.5) • 127 reviews</span>
        </div>

        {/* View Details Button */}
        <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200/50 rounded-xl">
          <div className="flex items-center justify-center gap-2 text-blue-700 text-sm font-semibold">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>👁️ Click anywhere to view details</span>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Futuristic action button */}
        <button
          className={`group/btn relative w-full py-4 px-6 rounded-2xl font-bold text-lg shadow-[0_15px_35px_-5px_rgba(16,185,129,0.3)] transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-emerald-300/50 overflow-hidden border-2 ${
            added
              ? 'bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white border-green-400/80 shadow-[0_20px_40px_-5px_rgba(34,197,94,0.4)]'
              : 'bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 hover:via-green-400 hover:to-emerald-500 text-white hover:shadow-[0_20px_45px_-5px_rgba(16,185,129,0.5)] border-emerald-400/80 hover:border-emerald-300'
          }`}
          onClick={handleAddToCart}
          disabled={added}
          style={{ minHeight: '60px' }}
          title={`Add ${product.name} to cart - ₹${product.pricePerUnit} per ${product.unit}`}
        >
          <span className="relative z-20 flex items-center justify-center gap-3">
            <ShoppingCart className={`w-6 h-6 transition-all duration-300 ${added ? 'animate-spin text-green-100' : 'group-hover/btn:animate-bounce text-white'}`} />
            <span className="font-black text-xl tracking-wide">
              {added ? '✅ ADDED TO CART!' : '🛒 ADD TO CART'}
            </span>
            <Zap className={`w-5 h-5 transition-all duration-300 ${added ? 'opacity-100 animate-pulse text-yellow-300' : 'opacity-0 group-hover/btn:opacity-100 group-hover/btn:text-yellow-200'}`} />
          </span>

          {/* Enhanced glow effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
          <div className="absolute inset-0 bg-emerald-400/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
          
          {/* Holographic border */}
          <div className="absolute inset-0 border-2 border-white/20 rounded-2xl group-hover/btn:border-white/40 transition-colors duration-300"></div>
          
          {/* Pulsing energy core */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-green-400/20 to-emerald-400/10 animate-pulse rounded-2xl"></div>
          
          {/* Circuit-like details */}
          <div className="absolute top-1 left-4 w-8 h-0.5 bg-emerald-300/40 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute bottom-1 right-4 w-8 h-0.5 bg-emerald-300/40 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
        </button>

        {/* Enhanced low stock warning */}
        {isLowStock && (
          <div className="mt-4 p-3 bg-gradient-to-r from-red-50/90 to-pink-50/90 backdrop-blur-lg border-2 border-red-400/50 rounded-2xl shadow-[0_8px_32px_-8px_rgba(239,68,68,0.2)]">
            <p className="text-xs text-red-700 font-bold text-center tracking-wide flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
              ⚡ Hurry! Limited stock remaining
              <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            </p>
          </div>
        )}
      </div>

      {/* Advanced futuristic corner accents */}
      <div className="absolute top-0 left-0 w-12 h-12 opacity-0 group-hover:opacity-100 transition-all duration-700">
        <div className="absolute top-2 left-2 w-8 h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400"></div>
        <div className="absolute top-2 left-2 w-0.5 h-8 bg-gradient-to-b from-emerald-400 to-cyan-400"></div>
        <div className="absolute top-1 left-1 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
      </div>
      
      <div className="absolute top-0 right-0 w-12 h-12 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100">
        <div className="absolute top-2 right-2 w-8 h-0.5 bg-gradient-to-l from-emerald-400 to-cyan-400"></div>
        <div className="absolute top-2 right-2 w-0.5 h-8 bg-gradient-to-b from-emerald-400 to-cyan-400"></div>
        <div className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-12 h-12 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-200">
        <div className="absolute bottom-2 left-2 w-8 h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400"></div>
        <div className="absolute bottom-2 left-2 w-0.5 h-8 bg-gradient-to-t from-emerald-400 to-cyan-400"></div>
        <div className="absolute bottom-1 left-1 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
      </div>
      
      <div className="absolute bottom-0 right-0 w-12 h-12 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-300">
        <div className="absolute bottom-2 right-2 w-8 h-0.5 bg-gradient-to-l from-emerald-400 to-cyan-400"></div>
        <div className="absolute bottom-2 right-2 w-0.5 h-8 bg-gradient-to-t from-emerald-400 to-cyan-400"></div>
        <div className="absolute bottom-1 right-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default ProductCard; 