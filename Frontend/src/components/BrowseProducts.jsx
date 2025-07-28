import React, { useState, useEffect } from 'react';
import { Package, Search, Grid, List, Filter } from 'lucide-react';
import ProductCard from './ProductCard';

const BrowseProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const categories = ['all', 'vegetables', 'fruits', 'spices', 'grains', 'dairy', 'beaverages', 'packaged', 'others'];

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8000/api/product/getAllProducts');
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.products || []);
        // Calculate total pages (assuming 12 products per page)
        setTotalPages(Math.ceil((data.products || []).length / 12));
      } else {
        setError('Failed to fetch products');
        setProducts([]);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const productsPerPage = 12;
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/50 overflow-hidden mb-8">
          <div className="p-8 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="bg-emerald-100 p-4 rounded-2xl">
                <Package className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent mb-2">
                  Browse All Products
                </h1>
                <p className="text-gray-600 text-lg">
                  Discover our complete collection of fresh products
                </p>
              </div>
            </div>

            {/* Statistics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-2xl border border-emerald-200">
                <div className="flex items-center gap-3">
                  <Package className="w-6 h-6 text-emerald-600" />
                  <div>
                    <div className="text-2xl font-bold text-emerald-600">{products.length}</div>
                    <div className="text-sm text-emerald-600">Total Products</div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-2xl border border-blue-200">
                <div className="flex items-center gap-3">
                  <Package className="w-6 h-6 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {products.filter(p => p.discount > 0).length}
                    </div>
                    <div className="text-sm text-blue-600">On Sale</div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-2xl border border-purple-200">
                <div className="flex items-center gap-3">
                  <Package className="w-6 h-6 text-purple-600" />
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {products.filter(p => p.quantityAvailable < 20).length}
                    </div>
                    <div className="text-sm text-purple-600">Low Stock</div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-2xl border border-orange-200">
                <div className="flex items-center gap-3">
                  <Package className="w-6 h-6 text-orange-600" />
                  <div>
                    <div className="text-2xl font-bold text-orange-600">
                      {categories.length - 1}
                    </div>
                    <div className="text-sm text-orange-600">Categories</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/50 overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-emerald-200/50 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-300/30 focus:border-emerald-400 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-emerald-600" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border-2 border-emerald-200/50 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-300/30 focus:border-emerald-400 transition-all duration-300"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-emerald-50 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'grid' ? 'bg-white shadow-lg text-emerald-600' : 'text-emerald-500 hover:text-emerald-600'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'list' ? 'bg-white shadow-lg text-emerald-600' : 'text-emerald-500 hover:text-emerald-600'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {loading ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/50 overflow-hidden">
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500 mx-auto mb-4"></div>
              <p className="text-emerald-600 font-semibold text-lg">Loading amazing products...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/50 overflow-hidden">
            <div className="p-12 text-center">
              <div className="text-red-500 mb-4">
                <Package className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-gray-400 mb-2">Error Loading Products</h3>
              <p className="text-gray-500">{error}</p>
            </div>
          </div>
        ) : (
          <>
            {/* Results Summary */}
            <div className="mb-6 p-4 bg-emerald-50/80 border border-emerald-200/50 rounded-2xl">
              <p className="text-center text-emerald-700 font-semibold">
                Showing {currentProducts.length} of {filteredProducts.length} products
                {searchTerm && ` for "${searchTerm}"`}
                {selectedCategory !== 'all' && ` in ${selectedCategory}`}
              </p>
            </div>

            {/* Products Display */}
            <div className={`grid gap-8 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <div className="col-span-full">
                  <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/50 overflow-hidden">
                    <div className="p-12 text-center">
                      <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                      <h3 className="text-2xl font-bold text-gray-400 mb-2">No Products Found</h3>
                      <p className="text-gray-500 mb-6">
                        Try adjusting your search or category filter.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-emerald-200/50 p-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
                          currentPage === page
                            ? 'bg-emerald-500 text-white'
                            : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Scroll to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 z-50"
          title="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default BrowseProducts; 