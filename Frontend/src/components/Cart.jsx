import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, clearCart } from '../store';
import { Trash2, ShoppingCart, Package, CreditCard, CheckCircle, AlertCircle, X } from 'lucide-react';

const Cart = () => {
  const items = useSelector(state => state.cart.items);
  const { user, isLoggedIn } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showUPIGateway, setShowUPIGateway] = useState(false);
  const [upiForm, setUpiForm] = useState({
    upiId: '',
    name: '',
    amount: 0
  });
  
  const subtotal = items.reduce((sum, item) => sum + (item.pricePerUnit * (item.quantity || 1)), 0);
  const shipping = items.length > 0 ? 5.00 : 0;
  const total = subtotal + shipping;

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(itemId));
    } else {
      // Update the item quantity in the cart
      const updatedItems = items.map(item => 
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      );
      // Clear cart and re-add items with updated quantities
      dispatch(clearCart());
      updatedItems.forEach(item => {
        dispatch({ type: 'cart/addToCart', payload: item });
      });
    }
  };

  const syncCartToBackend = async () => {
    if (!isLoggedIn || items.length === 0) {
      console.log('Skipping cart sync - user not logged in or cart empty');
      return;
    }
    
    try {
      console.log('Syncing cart to backend with items:', items);
      console.log('User info:', user);
      
      // Test authentication first
      const authTestResponse = await fetch('http://localhost:8000/api/cart/getMyCart', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (!authTestResponse.ok) {
        if (authTestResponse.status === 401) {
          throw new Error('Please login again to continue');
        }
        const authError = await authTestResponse.json();
        console.error('Authentication test failed:', authError);
        throw new Error(authError.message || 'Authentication failed');
      }
      
      console.log('Authentication test passed, proceeding with cart sync');
      
      // Clear backend cart first
      const clearResponse = await fetch('http://localhost:8000/api/cart/clearMyCart', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!clearResponse.ok) {
        const clearError = await clearResponse.json();
        console.error('Failed to clear cart:', clearError);
        throw new Error(clearError.message || 'Failed to clear cart');
      }
      
      console.log('Cart cleared successfully');

      // Add each item to backend cart
      for (const item of items) {
        console.log('Adding item to cart:', {
          productId: item._id,
          quantity: item.quantity || 1,
          name: item.name
        });
        
        const addResponse = await fetch('http://localhost:8000/api/cart/addToCart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            productId: item._id,
            quantity: item.quantity || 1
          })
        });
        
        if (!addResponse.ok) {
          const addError = await addResponse.json();
          console.error('Failed to add item to cart:', addError);
          throw new Error(addError.message || `Failed to add ${item.name} to cart`);
        }
        
        const addResult = await addResponse.json();
        console.log('Item added successfully:', addResult);
      }
      
      console.log('Cart sync completed successfully');
    } catch (err) {
      console.error('Cart sync error:', err);
      throw err; // Re-throw the original error with more context
    }
  };

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      setError('Please login to place an order');
      return;
    }

    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    // If UPI payment is selected, show the fake payment gateway
    if (paymentMethod === 'upi') {
      setUpiForm({
        upiId: '',
        name: user?.name || '',
        amount: total
      });
      setShowUPIGateway(true);
      return;
    }

    // For COD, proceed directly with order placement
    await processOrder();
  };

  const processOrder = async (customPaymentMethod = null) => {
    setIsProcessing(true);
    setError('');

    try {
      console.log('Starting order process with items:', items);
      console.log('User logged in:', isLoggedIn);
      console.log('Payment method:', customPaymentMethod || paymentMethod);
      
      // Use custom payment method if provided, otherwise use the state value
      const finalPaymentMethod = customPaymentMethod || paymentMethod;
      
      let orderResponse;
      
      // Try to sync cart to backend first, then use normal order endpoint
      try {
        await syncCartToBackend();
        console.log('Cart sync successful, using orderFromCart endpoint');
        
        orderResponse = await fetch('http://localhost:8000/api/order/orderFromCart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            paymentMethod: finalPaymentMethod
          })
        });
        
      } catch (syncError) {
        console.error('Cart sync failed:', syncError);
        console.log('Using direct order endpoint as fallback');
        
        // If sync fails, use direct order endpoint with cart data
        orderResponse = await fetch('http://localhost:8000/api/order/orderDirect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            paymentMethod: finalPaymentMethod,
            cartItems: items
          })
        });
      }

      const data = await orderResponse.json();
      console.log('Order response status:', orderResponse.status);
      console.log('Order response data:', data);

      if (orderResponse.ok) {
        console.log('Order placed successfully!');
        setOrderSuccess(true);
        dispatch(clearCart());
        
        // Auto redirect after 3 seconds
        setTimeout(() => {
          setOrderSuccess(false);
          setShowUPIGateway(false);
          navigate('/'); // Redirect to home page
        }, 3000);
      } else {
        console.error('Order failed with status:', orderResponse.status);
        console.error('Order failed with data:', data);
        
        // Handle specific error cases
        if (orderResponse.status === 401) {
          setError('Please login again to place your order');
        } else if (orderResponse.status === 400 && data.message.includes('Cart is empty')) {
          setError('Your cart appears to be empty. Please add items and try again.');
        } else {
          setError(data.message || `Order failed: ${orderResponse.status}`);
        }
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Network error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUPIPayment = async () => {
    if (!upiForm.upiId || !upiForm.name) {
      setError('Please fill all UPI details');
      return;
    }

    setIsProcessing(true);
    setError('');

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // After successful "payment", place the order with 'upi' payment method
    await processOrder('upi');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 py-8">
      {/* UPI Payment Gateway Modal */}
      {showUPIGateway && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-md transform transition-all duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">FreshPay UPI</h3>
                  <p className="text-blue-100">Secure Payment Gateway</p>
                </div>
                <button
                  onClick={() => {
                    setShowUPIGateway(false);
                    setError('');
                    setIsProcessing(false);
                  }}
                  className="text-white hover:text-red-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Payment Form */}
            <div className="p-6">
              {!orderSuccess ? (
                <>
                  {/* Amount Display */}
                  <div className="text-center mb-6">
                    <div className="text-sm text-gray-500 mb-1">Amount to Pay</div>
                    <div className="text-3xl font-bold text-green-600">₹{total.toFixed(2)}</div>
                  </div>

                  {/* UPI Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        UPI ID *
                      </label>
                      <input
                        type="text"
                        value={upiForm.upiId}
                        onChange={(e) => setUpiForm(prev => ({ ...prev, upiId: e.target.value }))}
                        placeholder="yourname@paytm / yourname@phonepe"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={upiForm.name}
                        onChange={(e) => setUpiForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Security Features */}
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                      <div className="flex items-center gap-2 text-green-700 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-medium">Secured by 256-bit SSL encryption</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-700 text-sm mt-1">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-medium">PCI DSS compliant payment processing</span>
                      </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <span className="text-red-700 text-sm">{error}</span>
                      </div>
                    )}

                    {/* Payment Button */}
                    <button
                      onClick={handleUPIPayment}
                      disabled={isProcessing || !upiForm.upiId || !upiForm.name}
                      className={`w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                        isProcessing || !upiForm.upiId || !upiForm.name
                          ? 'bg-gray-400 cursor-not-allowed opacity-50'
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-xl hover:scale-105'
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          Pay ₹{total.toFixed(2)}
                        </>
                      )}
                    </button>

                    {/* Cancel Button */}
                    <button
                      onClick={() => {
                        setShowUPIGateway(false);
                        setError('');
                        setIsProcessing(false);
                      }}
                      className="w-full py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
                      disabled={isProcessing}
                    >
                      Cancel Payment
                    </button>
                  </div>
                </>
              ) : (
                /* Success Animation */
                <div className="text-center py-8">
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full animate-bounce">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h3>
                  <p className="text-gray-600 mb-4">Your order has been placed successfully</p>
                  <p className="text-sm text-gray-500">Redirecting to home page...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Section - Cart Items */}
          <div className="flex-1">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/50 overflow-hidden">
              <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">
                    Your Shopping Cart
                  </h1>
                  <div className="text-lg text-gray-500 font-medium">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </div>
                </div>

                {items.length === 0 ? (
                  <div className="text-center py-16">
                    <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-gray-400 mb-2">Your cart is empty</h3>
                    <p className="text-gray-500">Add some products to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {items.map((item, index) => (
                      <div key={item._id} className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center gap-6">
                          {/* Product Image/Placeholder */}
                          <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                            <img 
                              src={item.imageUrl} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to colored placeholder if image fails
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                            <div 
                              className="w-full h-full hidden items-center justify-center text-white font-bold text-sm"
                              style={{
                                backgroundColor: ['#FF6B35', '#4CAF50', '#E91E63', '#9C27B0', '#FF9800'][index % 5]
                              }}
                            >
                              {item.name.split(' ')[0]}
                            </div>
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">
                              {item.name}
                            </h3>
                            <p className="text-gray-500 font-medium">
                              ₹{item.pricePerUnit} per {item.unit}
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-4">
                            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-2">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => updateQuantity(item._id, (item.quantity || 1) - 1)}
                                  className="w-8 h-8 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center"
                                >
                                  -
                                </button>
                                
                                <input
                                  type="number"
                                  min="1"
                                  value={item.quantity || 1}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value) || 1;
                                    updateQuantity(item._id, value);
                                  }}
                                  className="w-16 text-center text-lg font-bold text-emerald-700 bg-white border-2 border-emerald-200 rounded-lg py-1 focus:border-emerald-500 focus:outline-none"
                                />
                                
                                <button
                                  onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)}
                                  className="w-8 h-8 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Total Price for Item */}
                            <div className="text-right min-w-[100px]">
                              <div className="text-2xl font-bold text-gray-900">
                                ₹{(item.pricePerUnit * (item.quantity || 1)).toFixed(2)}
                              </div>
                            </div>

                            {/* Delete Button */}
                            <button
                              onClick={() => dispatch(removeFromCart(item._id))}
                              className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                              title="Remove item"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Section - Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/50 overflow-hidden sticky top-8">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {/* Subtotal */}
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Subtotal</span>
                    <span className="text-lg font-semibold text-gray-900">₹{subtotal.toFixed(2)}</span>
                  </div>
                  
                  {/* Shipping */}
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Shipping</span>
                    <span className="text-lg font-semibold text-gray-900">₹{shipping.toFixed(2)}</span>
                  </div>
                  
                  {/* Total */}
                  <div className="flex justify-between items-center py-4 border-t-2 border-gray-300">
                    <span className="text-xl font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-emerald-600">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  {/* Payment Method Selection */}
                  <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Payment Method</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash"
                          checked={paymentMethod === 'cash'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Cash on Delivery</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="upi"
                          checked={paymentMethod === 'upi'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm font-medium text-gray-700">UPI Payment</span>
                      </label>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <span className="text-red-700 font-medium">{error}</span>
                    </div>
                  )}

                  {/* Success Message */}
                  {orderSuccess && (
                    <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-700 font-medium">Order placed successfully! 🎉</span>
                    </div>
                  )}

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    className={`w-full py-4 px-6 rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                      isProcessing || items.length === 0 || orderSuccess
                        ? 'bg-gray-400 cursor-not-allowed opacity-50'
                        : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white hover:shadow-xl hover:scale-105'
                    }`}
                    disabled={items.length === 0 || isProcessing || orderSuccess}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing Order...
                      </>
                    ) : orderSuccess ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Order Placed Successfully!
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Proceed to Checkout
                      </>
                    )}
                  </button>
                  
                  {/* Clear Cart Button */}
                  {items.length > 0 && !orderSuccess && (
                    <button
                      onClick={() => dispatch(clearCart())}
                      className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white py-3 px-6 rounded-2xl font-bold shadow-lg transition-all duration-200 flex items-center justify-center gap-3"
                    >
                      <Trash2 className="w-5 h-5" />
                      Clear Cart
                    </button>
                  )}

                  {/* Login Prompt */}
                  {!isLoggedIn && (
                    <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                      <p className="text-yellow-700 font-medium text-center">
                        Please <a href="/login" className="text-emerald-600 hover:text-emerald-700 font-bold">login</a> to place an order
                      </p>
                    </div>
                  )}
                </div>

                {/* Additional Info */}
                {items.length > 0 && (
                  <div className="mt-6 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl">
                    <div className="flex items-center gap-2 text-emerald-700 font-medium mb-2">
                      <Package className="w-4 h-4" />
                      Free shipping on orders over ₹500
                    </div>
                    <p className="text-sm text-emerald-600">
                      {subtotal >= 500 ? '✅ You qualify for free shipping!' : `Add ₹${(500 - subtotal).toFixed(2)} more for free shipping`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 