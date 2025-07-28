import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

const TABS = ['Add Product', 'My Products'];

const SellerDashboard = () => {
  const user = useSelector(state => state.auth.user);
  const [activeTab, setActiveTab] = useState('Add Product');
  // Add Product State
  const [form, setForm] = useState({
    name: '', description: '', category: '', pricePerUnit: '', unit: '', quantityAvailable: '', discount: '', image: null, isActive: true
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState(null);
  const [addSuccess, setAddSuccess] = useState(false);
  const imageInputRef = useRef();
  // My Products State
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState(null);
  // Edit Product State
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const [editSuccess, setEditSuccess] = useState(false);

  // Fetch seller products
  const fetchProducts = async () => {
    setProductsLoading(true);
    setProductsError(null);
    try {
      const res = await fetch(`http://localhost:8000/api/product/getSellerProducts/${user._id}`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) setProducts(data.products);
      else setProductsError('Failed to fetch products');
    } catch {
      setProductsError('Failed to fetch products');
    } finally {
      setProductsLoading(false);
    }
  };
  useEffect(() => { if (activeTab === 'My Products') fetchProducts(); }, [activeTab]);

  // Add Product
  const handleAddChange = e => {
    const { name, value, files, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : (files ? files[0] : value)
    }));
  };
  const handleAddProduct = async e => {
    e.preventDefault();
    setAddLoading(true); setAddError(null); setAddSuccess(false);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('category', form.category);
      formData.append('pricePerUnit', Number(form.pricePerUnit));
      formData.append('unit', form.unit);
      formData.append('quantityAvailable', Number(form.quantityAvailable));
      formData.append('discount', Number(form.discount));
      formData.append('isActive', form.isActive);
      if (form.image) formData.append('image', form.image);
      const res = await fetch('http://localhost:8000/api/product/addProduct', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setAddSuccess(true);
        setForm({ name: '', description: '', category: '', pricePerUnit: '', unit: '', quantityAvailable: '', discount: '', image: null, isActive: true });
        if (imageInputRef.current) imageInputRef.current.value = '';
        fetchProducts();
      } else {
        setAddError(data.message || 'Failed to add product');
        console.error('Add product error:', data);
      }
    } catch (err) {
      setAddError('Failed to add product');
      console.error('Add product error:', err);
    } finally {
      setAddLoading(false);
    }
  };

  // Edit Product
  const startEdit = p => {
    setEditId(p._id);
    setEditForm({ ...p, image: null });
    setEditError(null);
    setEditSuccess(false);
  };
  const handleEditChange = e => {
    const { name, value, files } = e.target;
    setEditForm(f => ({ ...f, [name]: files ? files[0] : value }));
  };
  const handleEditProduct = async e => {
    e.preventDefault();
    setEditLoading(true); setEditError(null); setEditSuccess(false);
    try {
      const formData = new FormData();
      Object.entries(editForm).forEach(([k, v]) => v && k !== '_id' && formData.append(k, v));
      const res = await fetch(`http://localhost:8000/api/product/editProductDetails/${editId}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setEditSuccess(true);
        setEditId(null);
        fetchProducts();
      } else setEditError(data.message || 'Failed to edit product');
    } catch {
      setEditError('Failed to edit product');
    } finally {
      setEditLoading(false);
    }
  };

  // Delete Product
  const handleDelete = async id => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await fetch(`http://localhost:8000/api/product/deleteProduct/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      fetchProducts();
    } catch {}
  };

  // Toggle Product Status
  const handleToggleStatus = async id => {
    try {
      await fetch(`http://localhost:8000/api/product/toggleProductStatus/${id}`, {
        method: 'PUT',
        credentials: 'include',
      });
      fetchProducts();
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-green-200/50 p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                  Seller Dashboard
                </h1>
                <p className="text-gray-600 text-lg">Manage your products with ease and efficiency</p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex gap-2 p-2 bg-white/70 backdrop-blur-xl rounded-2xl border border-green-200/50 shadow-xl">
            {TABS.map((tab, index) => (
              <button
                key={tab}
                className={`relative px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                  activeTab === tab 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25' 
                    : 'text-green-700 hover:bg-green-50 hover:text-green-800'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                <span className="relative z-10">{tab}</span>
                {activeTab === tab && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl blur-xl"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Add Product Form */}
        {activeTab === 'Add Product' && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-green-200/50 p-8 shadow-2xl">
            <form className="space-y-8" onSubmit={handleAddProduct}>
              {/* Product Name and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-green-700 mb-2">Product Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={form.name} 
                    onChange={handleAddChange} 
                    className="w-full px-4 py-4 rounded-xl bg-green-50 border border-green-200 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter product name..."
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-green-700 mb-2">Category</label>
                  <div className="relative">
                    <select 
                      name="category" 
                      value={form.category} 
                      onChange={handleAddChange} 
                      className="w-full px-4 py-4 rounded-xl bg-green-50 border border-green-200 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 appearance-none"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="vegetables">🥬 Vegetables</option>
                      <option value="fruits">🍎 Fruits</option>
                      <option value="spices">🌶️ Spices</option>
                      <option value="grains">🌾 Grains</option>
                      <option value="dairy">🥛 Dairy</option>
                      <option value="packaged">📦 Packaged</option>
                      <option value="others">🔍 Others</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Unit, Price, and Quantity */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-green-700 mb-2">Unit</label>
                  <div className="relative">
                    <select 
                      name="unit" 
                      value={form.unit} 
                      onChange={handleAddChange} 
                      className="w-full px-4 py-4 rounded-xl bg-green-50 border border-green-200 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 appearance-none"
                      required
                    >
                      <option value="">Select Unit</option>
                      <option value="kg">kg</option>
                      <option value="l">l</option>
                      <option value="ml">ml</option>
                      <option value="pcs">pcs</option>
                      <option value="gm">gm</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-green-700 mb-2">Price Per Unit</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-green-600 font-bold">₹</span>
                    </div>
                    <input 
                      type="number" 
                      name="pricePerUnit" 
                      value={form.pricePerUnit} 
                      onChange={handleAddChange} 
                      className="w-full pl-8 pr-4 py-4 rounded-xl bg-green-50 border border-green-200 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                      placeholder="0.00"
                      required 
                      min="0" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-green-700 mb-2">Quantity Available</label>
                  <input 
                    type="number" 
                    name="quantityAvailable" 
                    value={form.quantityAvailable} 
                    onChange={handleAddChange} 
                    className="w-full px-4 py-4 rounded-xl bg-green-50 border border-green-200 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="0"
                    required 
                    min="0" 
                  />
                </div>
              </div>

              {/* Description, Discount, Image, and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-green-700 mb-2">Discount (%)</label>
                  <input 
                    type="number" 
                    name="discount" 
                    value={form.discount} 
                    onChange={handleAddChange} 
                    className="w-full px-4 py-4 rounded-xl bg-green-50 border border-green-200 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="0"
                    min="0" 
                    max="100" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-green-700 mb-2">Description</label>
                  <input 
                    type="text" 
                    name="description" 
                    value={form.description} 
                    onChange={handleAddChange} 
                    className="w-full px-4 py-4 rounded-xl bg-green-50 border border-green-200 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="Product description..."
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-green-700 mb-2">Product Image</label>
                  <input 
                    type="file" 
                    name="image" 
                    accept="image/*" 
                    onChange={handleAddChange} 
                    ref={imageInputRef} 
                    className="w-full px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-500 file:text-white hover:file:bg-green-600 transition-all duration-300"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={form.isActive}
                        onChange={handleAddChange}
                        className="sr-only"
                      />
                      <div className={`relative w-16 h-8 rounded-full transition-all duration-300 ease-in-out ${
                        form.isActive 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/30' 
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}>
                        <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-300 ease-in-out flex items-center justify-center ${
                          form.isActive ? 'translate-x-8' : 'translate-x-0'
                        }`}>
                          {form.isActive ? (
                            <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="text-green-700 font-medium">
                      {form.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <button 
                  type="submit" 
                  className="group relative px-12 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-green-500/25 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
                  disabled={addLoading}
                >
                  <span className="relative z-10">
                    {addLoading ? (
                      <div className="flex items-center space-x-2">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Add Product</span>
                      </div>
                    )}
                  </span>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>

              {/* Error and Success Messages */}
              {addError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{addError}</span>
                  </div>
                </div>
              )}
              
              {addSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Product added successfully! 🚀</span>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}

        {/* My Products Section */}
        {activeTab === 'My Products' && (
          <div className="space-y-6">
            {productsLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-16 h-16 border-4 border-emerald-500/30 border-b-emerald-500 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDelay: '-0.15s'}}></div>
                </div>
              </div>
            ) : productsError ? (
              <div className="text-center py-20">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl inline-block">
                  <div className="flex items-center space-x-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-lg">{productsError}</span>
                  </div>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-green-200/50 p-12">
                  <svg className="w-20 h-20 text-green-400/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <h3 className="text-xl font-semibold text-green-700 mb-2">No Products Found</h3>
                  <p className="text-gray-600">Start by adding your first product to the inventory</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product, index) => (
                  <div 
                    key={product._id} 
                    className="group relative bg-white/80 backdrop-blur-xl rounded-2xl border border-green-200/50 p-6 shadow-xl hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300 transform hover:-translate-y-2"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    {/* Product Image */}
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Status Badge */}
                      <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${
                        product.isActive 
                          ? 'bg-green-500/20 text-green-700 border border-green-500/30' 
                          : 'bg-red-500/20 text-red-700 border border-red-500/30'
                      }`}>
                        {product.isActive ? '🟢 Active' : '🔴 Inactive'}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                        {product.name}
                      </h3>
                      
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {product.description}
                      </p>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-green-50 rounded-lg p-2">
                          <span className="text-green-600 font-medium">Category:</span>
                          <div className="text-gray-900 capitalize">{product.category}</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-2">
                          <span className="text-green-600 font-medium">Price:</span>
                          <div className="text-gray-900 font-bold">₹{product.pricePerUnit}/{product.unit}</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-2">
                          <span className="text-green-600 font-medium">Stock:</span>
                          <div className="text-gray-900">{product.quantityAvailable}</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-2">
                          <span className="text-green-600 font-medium">Discount:</span>
                          <div className="text-gray-900">{product.discount}%</div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4">
                        <button 
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm font-semibold hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                          onClick={() => startEdit(product)}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg text-sm font-semibold hover:from-red-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                          onClick={() => handleDelete(product._id)}
                        >
                          🗑️ Delete
                        </button>
                        <button 
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg ${
                            product.isActive 
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600' 
                              : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
                          }`}
                          onClick={() => handleToggleStatus(product._id)}
                        >
                          {product.isActive ? '⏸️ Pause' : '▶️ Activate'}
                        </button>
                      </div>

                      {/* Edit Form */}
                      {editId === product._id && (
                        <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200 animate-fadeIn">
                          <form className="space-y-4" onSubmit={handleEditProduct}>
                            <input 
                              type="text" 
                              name="name" 
                              value={editForm.name || ''} 
                              onChange={handleEditChange} 
                              className="w-full px-3 py-2 rounded-lg bg-white border border-green-200 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                              placeholder="Product name..."
                              required 
                            />
                            <input 
                              type="text" 
                              name="description" 
                              value={editForm.description || ''} 
                              onChange={handleEditChange} 
                              className="w-full px-3 py-2 rounded-lg bg-white border border-green-200 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                              placeholder="Description..."
                              required 
                            />
                            <div className="grid grid-cols-2 gap-3">
                              <input 
                                type="number" 
                                name="pricePerUnit" 
                                value={editForm.pricePerUnit || ''} 
                                onChange={handleEditChange} 
                                className="w-full px-3 py-2 rounded-lg bg-white border border-green-200 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                placeholder="Price..."
                                required 
                                min="0" 
                              />
                              <input 
                                type="number" 
                                name="quantityAvailable" 
                                value={editForm.quantityAvailable || ''} 
                                onChange={handleEditChange} 
                                className="w-full px-3 py-2 rounded-lg bg-white border border-green-200 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                placeholder="Quantity..."
                                required 
                                min="0" 
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <input 
                                type="number" 
                                name="discount" 
                                value={editForm.discount || ''} 
                                onChange={handleEditChange} 
                                className="w-full px-3 py-2 rounded-lg bg-white border border-green-200 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                placeholder="Discount %..."
                                min="0" 
                                max="100" 
                              />
                              <input 
                                type="file" 
                                name="image" 
                                accept="image/*" 
                                onChange={handleEditChange} 
                                className="w-full px-3 py-2 rounded-lg bg-white border border-green-200 text-gray-700 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-medium file:bg-green-500 file:text-white hover:file:bg-green-600 text-sm"
                              />
                            </div>
                            <div className="flex gap-2 pt-2">
                              <button 
                                type="submit" 
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold text-sm hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                disabled={editLoading}
                              >
                                {editLoading ? '💾 Saving...' : '💾 Save'}
                              </button>
                              <button 
                                type="button" 
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-300 transform hover:scale-105 transition-all duration-200 shadow-lg"
                                onClick={() => setEditId(null)} 
                                disabled={editLoading}
                              >
                                ✖️ Cancel
                              </button>
                            </div>
                            {editError && (
                              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                                {editError}
                              </div>
                            )}
                            {editSuccess && (
                              <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm">
                                Product updated successfully! ✨
                              </div>
                            )}
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
