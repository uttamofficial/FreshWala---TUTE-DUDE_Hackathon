import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import ProductCard from './ProductCard';

const SearchResults = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  // Prefer state if available (for category search), else fallback to query param
  const productsFromState = location.state?.products;
  const keywordFromState = location.state?.keyword;
  const keywordFromQuery = searchParams.get('keyword') || location.state?.query || '';
  const [products, setProducts] = useState(productsFromState || []);
  const [keyword, setKeyword] = useState(keywordFromState || keywordFromQuery);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If products are passed from state (category search), use them directly
    if (productsFromState && keywordFromState) {
      setProducts(productsFromState);
      setKeyword(keywordFromState);
      return;
    }
    // Otherwise, fetch by keyword
    if (keywordFromQuery) {
      setLoading(true);
      fetch('http://localhost:8000/api/product/searchProducts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: keywordFromQuery })
      })
        .then(res => res.json())
        .then(data => {
          setProducts(data.products || []);
          setKeyword(keywordFromQuery);
        })
        .catch(() => setProducts([]))
        .finally(() => setLoading(false));
    }
  }, [productsFromState, keywordFromState, keywordFromQuery]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        {keyword ? `Category: "${keyword.charAt(0).toUpperCase() + keyword.slice(1)}"` : 'Search Results'}
      </h1>
      {loading ? (
        <div className="text-center text-lg text-gray-500">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center text-xl text-gray-500 py-12">
              No products available in the current category.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
