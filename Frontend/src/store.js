import { configureStore, createSlice } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const initialAuthState = {
  user: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    logout(state) {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

export const { login, logout } = authSlice.actions;

const persistConfig = {
  key: 'auth',
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authSlice.reducer);

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    addToCart(state, action) {
      const existing = state.items.find(item => item._id === action.payload._id);
      if (existing) {
        // If product already exists, add the new quantity to existing quantity
        existing.quantity = (existing.quantity || 1) + (action.payload.quantity || 1);
      } else {
        // If product doesn't exist, add it with the specified quantity
        state.items.push({ ...action.payload, quantity: action.payload.quantity || 1 });
      }
    },
    setCartItems(state, action) {
      state.items = action.payload;
    },
    updateCartItem(state, action) {
      const { _id, quantity } = action.payload;
      const existing = state.items.find(item => item._id === _id);
      if (existing && quantity > 0) {
        existing.quantity = quantity;
      } else if (existing && quantity <= 0) {
        state.items = state.items.filter(item => item._id !== _id);
      }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter(item => item._id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, setCartItems, updateCartItem, removeFromCart, clearCart } = cartSlice.actions;

// Async action to sync cart with backend
export const syncAddToCart = (product) => async (dispatch, getState) => {
  try {
    // Add to local state first
    dispatch(addToCart(product));
    
    // Check if user is logged in
    const { auth } = getState();
    if (auth.isLoggedIn) {
      // Sync with backend
      await fetch('http://localhost:8000/api/cart/addToCart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          productId: product._id,
          quantity: product.quantity || 1
        })
      });
    }
  } catch (error) {
    console.error('Failed to sync cart with backend:', error);
    // Cart is still added locally even if backend sync fails
  }
};

const cartPersistConfig = {
  key: 'cart',
  storage,
};

const persistedCartReducer = persistReducer(cartPersistConfig, cartSlice.reducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    cart: persistedCartReducer,
  },
});

export const persistor = persistStore(store);

export default store; 