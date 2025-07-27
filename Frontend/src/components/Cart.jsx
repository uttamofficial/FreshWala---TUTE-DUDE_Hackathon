import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart } from '../store';

const Cart = () => {
  const items = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
  const total = items.reduce((sum, item) => sum + (item.pricePerUnit * (item.quantity || 1)), 0);

  return (
    <div className="max-w-3xl mx-auto my-10 bg-white rounded-2xl shadow-2xl p-8">
      <h2 className="text-3xl font-bold mb-8 text-gray-900">Your Cart</h2>
      {items.length === 0 ? (
        <div className="text-center text-lg text-gray-500">Your cart is empty.</div>
      ) : (
        <>
          <ul className="divide-y divide-gray-200">
            {items.map(item => (
              <li key={item._id} className="flex items-center py-6 gap-6">
                <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-xl border border-gray-200" />
                <div className="flex-1">
                  <div className="font-semibold text-lg text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-500">₹{item.pricePerUnit} x {item.quantity || 1}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-xl font-bold text-green-600">₹{item.pricePerUnit * (item.quantity || 1)}</div>
                  <button
                    className="text-red-500 hover:text-red-700 text-sm font-semibold"
                    onClick={() => dispatch(removeFromCart(item._id))}
                  >Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center mt-8">
            <div className="text-2xl font-bold text-gray-900">Total: ₹{total}</div>
            <button
              className="bg-red-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:bg-red-600 transition-all"
              onClick={() => dispatch(clearCart())}
            >Clear Cart</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart; 