import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const dispatch = useDispatch();

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

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!product) return null;

  return (
    <div className="max-w-3xl mx-auto my-10 bg-white rounded-2xl shadow-2xl p-8 flex flex-col md:flex-row gap-8">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full md:w-80 h-80 object-cover rounded-xl border border-gray-200 shadow-lg"
      />
      <div className="flex-1 flex flex-col gap-4">
        <h2 className="text-3xl font-bold text-gray-900">{product.name}</h2>
        <div className="text-lg text-gray-600">{product.description}</div>
        <div className="flex gap-4 items-center mt-2">
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">{product.category}</span>
          {product.discount > 0 && (
            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">{product.discount}% OFF</span>
          )}
        </div>
        <div className="mt-4 text-2xl font-extrabold text-green-600">
          ₹{product.pricePerUnit} <span className="text-base font-medium text-gray-500">/ {product.unit}</span>
        </div>
        <div className="text-sm text-gray-500">Available: {product.quantityAvailable} {product.unit}</div>
        <div className="text-sm text-gray-500">Total Sold: {product.totalSold}</div>
        <div className="text-xs text-gray-400 mt-2">Added: {new Date(product.createdAt).toLocaleDateString()}</div>
        <div className="text-xs text-gray-400">Last Updated: {new Date(product.updatedAt).toLocaleDateString()}</div>
        <button
          className="mt-6 bg-gradient-to-tr from-green-400 via-green-500 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white px-8 py-3 rounded-xl text-lg font-bold shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
          onClick={() => {
            dispatch(addToCart(product));
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 1500);
          }}
        >
          Add to Cart
        </button>
        {addedToCart && (
          <div className="mt-2 text-green-600 font-semibold animate-pulse">Added to cart!</div>
        )}
        {/* Add to cart or other actions can go here */}
      </div>
    </div>
  );
};

export default ProductDetail; 