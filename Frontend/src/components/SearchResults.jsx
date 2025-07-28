import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, TrendingUp, ShoppingCart } from 'lucide-react';
import ProductCard from './ProductCard';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!keyword) return;
    const knownCategories = ['vegetables', 'fruits', 'spices', 'grains', 'dairy', 'beaverages', 'packaged', 'others'];
    setLoading(true);
    if (knownCategories.includes(keyword.toLowerCase())) {
      fetch(`http://localhost:8000/api/product/searchByCategory?category=${encodeURIComponent(keyword)}`)
        .then(res => res.json())
        .then(data => setProducts(data.products || []))
        .catch(() => setProducts([]))
        .finally(() => setLoading(false));
    } else {
      fetch('http://localhost:8000/api/product/searchProducts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword })
      })
        .then(res => res.json())
        .then(data => setProducts(data.products || []))
        .catch(() => setProducts([]))
        .finally(() => setLoading(false));
    }
  }, [keyword]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Enhanced Header with Add to Cart Info */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/50 overflow-hidden mb-8">
          <div className="p-8 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="bg-emerald-100 p-4 rounded-2xl">
                <Search className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent mb-2">
                  {keyword
                    ? `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} Collection`
                    : 'Search Results'}
                </h1>
                <p className="text-gray-600 text-lg">
                  {keyword
                    ? `Discover amazing ${keyword} products - Click "Add to Cart" on any product!`
                    : 'Find exactly what you\'re looking for - Add items to your cart easily!'}
                </p>
              </div>
            </div>
            
           
            {/* Results Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
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
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/50 overflow-hidden">
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500 mx-auto mb-4"></div>
              <p className="text-emerald-600 font-semibold text-lg">Searching for amazing products...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/50 overflow-hidden">
                  <div className="p-12 text-center">
                    <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-gray-400 mb-2">No Products Found</h3>
                    <p className="text-gray-500 mb-6">
                      Try searching for a different category or keyword.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-400">
                      <span>Try:</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">vegetables</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">fruits</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">spices</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">dairy</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
