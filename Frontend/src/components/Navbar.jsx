import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, Menu, ChevronDown, Leaf } from 'lucide-react';
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
    setLoading(true);
    setShowDropdown(false);
    setSearchResults([]);
    try {
      const res = await fetch('http://localhost:8000/api/product/searchProducts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: category })
      });
      const data = await res.json();
      setLoading(false);
      if (data.products) {
        // Option 1: Pass results via navigation state
        navigate('/search', { state: { products: data.products, keyword: category } });
        // Option 2: If your SearchResults page fetches by keyword, just navigate with query param:
        // navigate(`/search?keyword=${encodeURIComponent(category)}`);
      }
    } catch (err) {
      setLoading(false);
      console.error('Category search error:', err);
    }
  };

  return (
    <nav className="backdrop-blur-lg bg-white/60 shadow-xl border-b border-gray-200 sticky top-0 z-50 rounded-b-2xl mx-2 mt-2" style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="w-10 h-10 bg-gradient-to-tr from-green-400 via-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-green-300 group-hover:scale-105 transition-transform">
                <Leaf className="w-6 h-6 text-white drop-shadow-lg" />
              </div>
              <span className="ml-3 text-2xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm group-hover:text-green-600 transition-colors">FreshWala</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/" className="text-gray-900 hover:text-green-500 px-3 py-2 text-base font-semibold transition-all duration-200 rounded-lg hover:bg-green-100/60 focus:outline-none focus:ring-2 focus:ring-green-400">
                Home
              </Link>
              <div className="relative group">
                <button className="text-gray-700 hover:text-green-500 px-3 py-2 text-base font-semibold transition-all duration-200 rounded-lg hover:bg-green-100/60 focus:outline-none focus:ring-2 focus:ring-green-400 flex items-center">
                  Categories
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                <div className="absolute top-full left-0 mt-1 w-52 bg-white/90 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 backdrop-blur-md border border-gray-100">
                  <div className="py-2">
                    <button onClick={() => handleCategorySearch('fruits')} className="block w-full text-left px-5 py-2 text-base text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-all">Fruits</button>
                    <button onClick={() => handleCategorySearch('vegetables')} className="block w-full text-left px-5 py-2 text-base text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-all">Vegetables</button>
                    <button onClick={() => handleCategorySearch('dairy')} className="block w-full text-left px-5 py-2 text-base text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-all">Dairy</button>
                    <button onClick={() => handleCategorySearch('snacks')} className="block w-full text-left px-5 py-2 text-base text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-all">Snacks</button>
                    <button onClick={() => handleCategorySearch('beverages')} className="block w-full text-left px-5 py-2 text-base text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-all">Beverages</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar - Centered */}
          <div className="flex-1 max-w-lg mx-8" ref={searchRef}>
            <form className="relative" onSubmit={handleSearch} autoComplete="off">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 w-5 h-5" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search for fresh products..."
                className="w-full pl-12 pr-4 py-2 border border-gray-200 rounded-xl bg-white/70 shadow-inner focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-base transition-all duration-200"
                onFocus={() => { if (searchResults.length > 0) setShowDropdown(true); }}
              />
              {/* Dropdown for search results */}
              {showDropdown && (
                <div className="absolute left-0 right-0 mt-2 bg-white/95 rounded-xl shadow-2xl border border-gray-100 z-50 max-h-80 overflow-y-auto backdrop-blur-md">
                  {loading ? (
                    <div className="p-4 text-center text-gray-500">Searching...</div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-4 text-center text-gray-400">No products found.</div>
                  ) : (
                    searchResults.map(product => (
                      <Link
                        key={product._id}
                        to={`/product/${product._id}`}  // Navigate to product details page
                        className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-all rounded-xl"
                        onClick={() => setShowDropdown(false)}
                      >
                        <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded-lg border border-gray-200" />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">{product.name}</div>
                          <div className="text-xs text-gray-500">{product.category} • ₹{product.pricePerUnit}/{product.unit}</div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-green-500 transition-colors">
              <ShoppingCart className="w-7 h-7" />
              <span className="absolute -top-2 -right-2 bg-gradient-to-tr from-green-400 via-green-500 to-emerald-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulse ring-2 ring-white font-bold">
                {cartCount}
              </span>
            </Link>
            {/* Profile/Login Button */}
            {isLoggedIn ? (
              <div className="relative group">
                <button className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-green-400 via-green-500 to-emerald-600 shadow-lg border-2 border-white hover:scale-105 transition-transform focus:outline-none">
                  {user && user.profilePhoto ? (
                    <img src={user.profilePhoto} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200">
                  {user && user.role === 'seller' && (
                    <Link to="/seller-dashboard" className="block px-5 py-3 text-base text-emerald-700 hover:bg-green-50 hover:text-emerald-900 rounded-t-xl transition-all font-semibold">Seller Dashboard</Link>
                  )}
                  <Link to="/profile" className="block px-5 py-3 text-base text-gray-700 hover:bg-green-50 hover:text-green-600 transition-all">Profile</Link>
                  <button
                    className="w-full text-left px-5 py-3 text-base text-red-600 hover:bg-red-50 hover:text-red-700 rounded-b-xl transition-all"
                    onClick={() => { dispatch(logout()); navigate('/'); }}
                  >Sign Out</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="bg-gradient-to-tr from-green-400 via-green-500 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white px-6 py-2 rounded-xl text-base font-bold shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400">
                Login/Signup
              </Link>
            )}
            <button className="md:hidden p-3 text-green-500 hover:bg-green-100 hover:text-green-700 rounded-full transition-all duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400">
              <Menu className="w-7 h-7" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
