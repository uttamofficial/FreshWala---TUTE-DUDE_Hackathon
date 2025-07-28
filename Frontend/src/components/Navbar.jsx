import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, Menu, Leaf } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store';

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartCount = useSelector(state => state.cart.items.reduce((sum, item) => sum + (item.quantity || 1), 0));

  useEffect(() => {
    // Hide dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Remove localStorage login state effect

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/product/searchProducts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: search })
      });
      const data = await res.json();
      setSearchResults(data.products || []);
      setShowDropdown(true);
    } catch (err) {
      setSearchResults([]);
      setShowDropdown(false);
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Hide dropdown if search is cleared
  useEffect(() => {
    if (!search.trim()) {
      setShowDropdown(false);
      setSearchResults([]);
    }
  }, [search]);

  const handleCategorySearch = async (category) => {
    setShowDropdown(false);
    setSearchResults([]);
    navigate(`/search?keyword=${encodeURIComponent(category)}`);
  };

  return (
    <nav className="backdrop-blur-xl bg-gradient-to-r from-white/80 via-white/70 to-emerald-50/60 shadow-2xl border-b border-emerald-200/50 sticky top-0 z-50 rounded-b-3xl mx-4 mt-3" style={{ boxShadow: '0 20px 40px 0 rgba(16, 185, 129, 0.1)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl ring-4 ring-emerald-200/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ease-out">
                <Leaf className="w-7 h-7 text-white drop-shadow-xl" />
              </div>
              <div className="ml-4 py-1">
                <span className="text-2xl font-black bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 bg-clip-text text-transparent tracking-tight drop-shadow-sm group-hover:scale-105 transition-transform duration-300">
                  FreshWala
                </span>
                <div className="text-xs font-medium text-emerald-600/70 mt-0.5">Fresh • Fast • Reliable</div>
              </div>
            </Link>
          </div>



          {/* Search Bar - Centered */}
          <div className="flex-1 max-w-xl mx-8" ref={searchRef}>
            <form className="relative" onSubmit={handleSearch} autoComplete="off">
              <div className="relative group">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 group-hover:text-emerald-600 transition-colors z-10">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search for fresh products, vegetables, fruits..."
                  className="w-full pl-11 pr-5 py-3 border-2 border-emerald-200/50 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-emerald-300/30 focus:border-emerald-400 text-base transition-all duration-300 placeholder-gray-400"
                  onFocus={() => { if (searchResults.length > 0) setShowDropdown(true); }}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-100/20 to-green-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              {/* Dropdown for search results */}
              {showDropdown && (
                <div className="absolute left-0 right-0 mt-2 bg-white/95 rounded-xl shadow-2xl border border-emerald-200/50 z-50 max-h-96 overflow-y-auto backdrop-blur-xl">
                  {loading ? (
                    <div className="p-6 text-center text-emerald-500 flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                      <span className="font-medium">Searching...</span>
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-6 text-center text-gray-400">
                      <div className="w-12 h-12 mx-auto mb-2 text-gray-300">
                        <Search className="w-full h-full" />
                      </div>
                      <span className="font-medium">No products found.</span>
                    </div>
                  ) : (
                    <div className="py-2">
                      {searchResults.map(product => (
                        <Link
                          key={product._id}
                          to={`/product/${product._id}`}
                          className="flex items-center gap-4 px-6 py-4 hover:bg-emerald-50 transition-all rounded-xl mx-2 group"
                          onClick={() => setShowDropdown(false)}
                        >
                          <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="w-14 h-14 object-cover rounded-xl border border-emerald-200 shadow-lg group-hover:scale-105 transition-transform" 
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-gray-800 text-lg group-hover:text-emerald-600 transition-colors">{product.name}</div>
                            <div className="text-sm text-gray-500 capitalize">{product.category} • <span className="font-bold text-emerald-600">₹{product.pricePerUnit}</span>/{product.unit}</div>
                          </div>
                          <div className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-8">
            <Link to="/cart" className="relative p-3 text-gray-600 hover:text-emerald-500 transition-all duration-300 group">
              <div className="relative">
                <ShoppingCart className="w-8 h-8 group-hover:scale-110 transition-transform" />
                <span className="absolute -top-3 -right-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm rounded-full w-7 h-7 flex items-center justify-center shadow-xl ring-4 ring-white font-bold group-hover:scale-110 transition-transform">
                  {cartCount}
                </span>
              </div>
            </Link>
            {/* Profile/Login Button */}
            {isLoggedIn ? (
              <div className="relative group">
                <button className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 shadow-xl border-4 border-white hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-300/50">
                  {user && user.profilePhoto ? (
                    <img src={user.profilePhoto} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <svg className="w-7 h-7 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </button>
                <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-emerald-200/50 z-50 opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                  <div className="py-3">
                    {user && user.role === 'seller' && (
                      <Link to="/seller-dashboard" className="px-6 py-3 text-lg text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 rounded-xl mx-2 transition-all font-semibold flex items-center space-x-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span>Seller Dashboard</span>
                      </Link>
                    )}
                    <Link to="/profile" className="px-6 py-3 text-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-xl mx-2 transition-all flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Profile</span>
                    </Link>
                    <Link to="/my-orders" className="px-6 py-3 text-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-xl mx-2 transition-all flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      <span>My Orders</span>
                    </Link>
                    <button
                      className="w-full text-left px-6 py-3 text-lg text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl mx-2 transition-all flex items-center space-x-3"
                      onClick={() => { dispatch(logout()); navigate('/'); }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 hover:from-emerald-600 hover:via-green-600 hover:to-teal-700 text-white px-8 py-3 rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-300/50">
                Login/Signup
              </Link>
            )}
            <button className="md:hidden p-3 text-emerald-500 hover:bg-emerald-100 hover:text-emerald-700 rounded-2xl transition-all duration-300 shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-300/50">
              <Menu className="w-8 h-8" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
