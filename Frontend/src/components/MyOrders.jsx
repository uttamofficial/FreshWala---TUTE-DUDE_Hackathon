import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Package, Clock, CheckCircle, Truck, AlertCircle, Calendar, MapPin, CreditCard } from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLoggedIn } = useSelector(state => state.auth);

  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
    }
  }, [isLoggedIn]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:8000/api/order/getMyOrders', {
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(data);
      } else {
        setError(data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      setError('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 border-yellow-400';
      case 'processing':
        return 'text-blue-600 bg-blue-100 border-blue-400';
      case 'shipped':
        return 'text-purple-600 bg-purple-100 border-purple-400';
      case 'delivered':
        return 'text-green-600 bg-green-100 border-green-400';
      case 'cancelled':
        return 'text-red-600 bg-red-100 border-red-400';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'processing':
        return <Package className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Please Login</h2>
          <p className="text-gray-600">You need to be logged in to view your orders.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-emerald-600 font-semibold text-lg">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/50 overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent mb-2">
                  My Orders
                </h1>
                <p className="text-gray-600 text-lg">Track your order history and current deliveries</p>
              </div>
              <div className="bg-emerald-100 p-4 rounded-2xl">
                <Package className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-2xl border border-emerald-200">
                <div className="text-2xl font-bold text-emerald-600">{orders.length}</div>
                <div className="text-sm text-emerald-600">Total Orders</div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-2xl border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">
                  {orders.filter(order => order.status === 'delivered').length}
                </div>
                <div className="text-sm text-blue-600">Delivered</div>
              </div>
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-2xl border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-600">
                  {orders.filter(order => order.status === 'pending' || order.status === 'processing').length}
                </div>
                <div className="text-sm text-yellow-600">Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/50 overflow-hidden">
            <div className="p-12 text-center">
              <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-400 mb-2">No Orders Yet</h3>
              <p className="text-gray-500 mb-6">Start shopping to see your orders here!</p>
              <button 
                onClick={() => window.history.back()}
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg transition-all duration-200"
              >
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/50 overflow-hidden hover:shadow-3xl transition-all duration-300">
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                      <div className="bg-emerald-100 p-3 rounded-2xl">
                        <Package className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">Order #{order._id.slice(-8)}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className={`px-4 py-2 rounded-full border-2 font-semibold flex items-center gap-2 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Products */}
                    <div>
                      <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Package className="w-5 h-5 text-emerald-600" />
                        Products
                      </h4>
                      <div className="space-y-3">
                        {order.products.map((item, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <img 
                              src={item.product.imageUrl} 
                              alt={item.product.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <div className="font-semibold text-gray-800">{item.product.name}</div>
                              <div className="text-sm text-gray-500">
                                Qty: {item.quantity} • ₹{item.unitPrice}/{item.product.unit}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-emerald-600">₹{(item.unitPrice * item.quantity).toFixed(2)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Info */}
                    <div>
                      <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-emerald-600" />
                        Order Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-semibold">₹{order.totalPrice?.toFixed(2) || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                          <span className="text-gray-600">Discount:</span>
                          <span className="font-semibold text-green-600">-₹{order.discountApplied?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="flex justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                          <span className="text-gray-800 font-bold">Total:</span>
                          <span className="font-bold text-emerald-600">₹{order.finalPrice?.toFixed(2) || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                          <span className="text-gray-600">Payment Method:</span>
                          <span className="font-semibold flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            {order.paymentMethod}
                          </span>
                        </div>
                        <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                          <span className="text-gray-600">Payment Status:</span>
                          <span className={`font-semibold ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  {order.deliveryAddress && (
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
                      <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        Delivery Address
                      </h4>
                      <p className="text-gray-700">{order.deliveryAddress}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders; 