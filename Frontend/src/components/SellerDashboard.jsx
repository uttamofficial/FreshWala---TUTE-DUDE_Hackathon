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
      Object.entries(form).forEach(([k, v]) => v && formData.append(k, v));
      formData.set('isActive', form.isActive);
      formData.append('category', form.category);
      formData.append('unit', form.unit);
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
      } else setAddError(data.message || 'Failed to add product');
    } catch {
      setAddError('Failed to add product');
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
    <div className="max-w-5xl mx-auto my-10 bg-white rounded-2xl shadow-2xl p-8">
      <h2 className="text-3xl font-bold mb-8 text-emerald-700">Seller Dashboard</h2>
      <div className="flex gap-4 mb-8">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`px-6 py-2 rounded-xl font-semibold text-lg transition-all ${activeTab === tab ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-emerald-700 hover:bg-emerald-50'}`}
            onClick={() => setActiveTab(tab)}
          >{tab}</button>
        ))}
      </div>
      {activeTab === 'Add Product' && (
        <form className="space-y-6" onSubmit={handleAddProduct}>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-sm text-emerald-700 mb-1">Product Name</label>
              <input type="text" name="name" value={form.name} onChange={handleAddChange} className="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-white focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-gray-900" required />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-emerald-700 mb-1">Category</label>
              <select name="category" value={form.category} onChange={handleAddChange} className="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-white focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-gray-900" required>
                <option value="">Select</option>
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="spices">Spices</option>
                <option value="grains">Grains</option>
                <option value="dairy">Dairy</option>
                <option value="packaged">Packaged</option>
                <option value="others">Others</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-sm text-emerald-700 mb-1">Unit</label>
              <select name="unit" value={form.unit} onChange={handleAddChange} className="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-white focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-gray-900" required>
                <option value="">Select</option>
                <option value="kg">kg</option>
                <option value="l">l</option>
                <option value="ml">ml</option>
                <option value="pcs">pcs</option>
                <option value="gm">gm</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm text-emerald-700 mb-1">Price Per Unit</label>
              <input type="number" name="pricePerUnit" value={form.pricePerUnit} onChange={handleAddChange} className="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-white focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-gray-900" required min="0" />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-emerald-700 mb-1">Quantity Available</label>
              <input type="number" name="quantityAvailable" value={form.quantityAvailable} onChange={handleAddChange} className="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-white focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-gray-900" required min="0" />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-sm text-emerald-700 mb-1">Discount (%)</label>
              <input type="number" name="discount" value={form.discount} onChange={handleAddChange} className="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-white focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-gray-900" min="0" max="100" />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-emerald-700 mb-1">Description</label>
              <input type="text" name="description" value={form.description} onChange={handleAddChange} className="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-white focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-gray-900" required />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-emerald-700 mb-1">Product Image</label>
              <input type="file" name="image" accept="image/*" onChange={handleAddChange} ref={imageInputRef} className="w-full px-4 py-2 rounded-xl border border-emerald-200 bg-white focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-gray-900" />
            </div>
            <div className="flex-1 flex items-center mt-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleAddChange}
                  className="rounded border-emerald-400 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-emerald-700">Active</span>
              </label>
            </div>
          </div>
          <button type="submit" className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700 transition-all text-lg" disabled={addLoading}>{addLoading ? 'Adding...' : 'Add Product'}</button>
          {addError && <div className="text-red-500 mt-2">{addError}</div>}
          {addSuccess && <div className="text-green-600 mt-2">Product added successfully!</div>}
        </form>
      )}
      {activeTab === 'My Products' && (
        <div>
          {productsLoading ? (
            <div className="text-center text-lg text-gray-500">Loading...</div>
          ) : productsError ? (
            <div className="text-center text-lg text-red-500">{productsError}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {products.map(product => (
                <div key={product._id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-3 border border-emerald-100 relative">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover rounded-lg border border-gray-200 mb-2" />
                  <div className="font-bold text-lg text-emerald-700">{product.name}</div>
                  <div className="text-gray-600">{product.description}</div>
                  <div className="text-sm text-gray-500">Category: {product.category}</div>
                  <div className="text-sm text-gray-500">Price: ₹{product.pricePerUnit} / {product.unit}</div>
                  <div className="text-sm text-gray-500">Available: {product.quantityAvailable}</div>
                  <div className="text-sm text-gray-500">Discount: {product.discount}%</div>
                  <div className="flex gap-2 mt-2">
                    <button className="px-4 py-1 bg-emerald-500 text-white rounded-lg text-sm font-semibold hover:bg-emerald-600" onClick={() => startEdit(product)}>Edit</button>
                    <button className="px-4 py-1 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600" onClick={() => handleDelete(product._id)}>Delete</button>
                    <button className={`px-4 py-1 rounded-lg text-sm font-semibold ${product.isActive ? 'bg-yellow-400 text-white hover:bg-yellow-500' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`} onClick={() => handleToggleStatus(product._id)}>{product.isActive ? 'Deactivate' : 'Activate'}</button>
                  </div>
                  {editId === product._id && (
                    <form className="mt-4 space-y-3" onSubmit={handleEditProduct}>
                      <input type="text" name="name" value={editForm.name} onChange={handleEditChange} className="w-full px-4 py-2 rounded-xl border border-emerald-200 bg-white text-gray-900" required />
                      <input type="text" name="description" value={editForm.description} onChange={handleEditChange} className="w-full px-4 py-2 rounded-xl border border-emerald-200 bg-white text-gray-900" required />
                      <input type="number" name="pricePerUnit" value={editForm.pricePerUnit} onChange={handleEditChange} className="w-full px-4 py-2 rounded-xl border border-emerald-200 bg-white text-gray-900" required min="0" />
                      <input type="number" name="quantityAvailable" value={editForm.quantityAvailable} onChange={handleEditChange} className="w-full px-4 py-2 rounded-xl border border-emerald-200 bg-white text-gray-900" required min="0" />
                      <input type="number" name="discount" value={editForm.discount} onChange={handleEditChange} className="w-full px-4 py-2 rounded-xl border border-emerald-200 bg-white text-gray-900" min="0" max="100" />
                      <input type="file" name="image" accept="image/*" onChange={handleEditChange} className="w-full px-4 py-2 rounded-xl border border-emerald-200 bg-white text-gray-900" />
                      <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition-all text-base" disabled={editLoading}>{editLoading ? 'Saving...' : 'Save'}</button>
                      <button type="button" className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl font-bold shadow-lg hover:bg-gray-300 transition-all text-base ml-2" onClick={() => setEditId(null)} disabled={editLoading}>Cancel</button>
                      {editError && <div className="text-red-500 mt-2">{editError}</div>}
                      {editSuccess && <div className="text-green-600 mt-2">Product updated!</div>}
                    </form>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SellerDashboard; 