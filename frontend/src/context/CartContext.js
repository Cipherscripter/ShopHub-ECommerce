import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();

// ─── Reducer ───────────────────────────────────────────────────────────────────
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'CART_LOADING':
      return { ...state, loading: true };
    case 'CART_SUCCESS':
      return { ...state, loading: false, cart: action.payload, error: null };
    case 'CART_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'CLEAR_CART':
      return { ...state, cart: null };
    default:
      return state;
  }
};

const initialState = {
  cart:    null,
  loading: false,
  error:   null,
};

// ─── Provider ──────────────────────────────────────────────────────────────────
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Fetch cart when user logs in
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    dispatch({ type: 'CART_LOADING' });
    try {
      const { data } = await cartAPI.get();
      dispatch({ type: 'CART_SUCCESS', payload: data.cart });
    } catch (err) {
      dispatch({ type: 'CART_ERROR', payload: 'Failed to load cart' });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [isAuthenticated, fetchCart]);

  // ─── Actions ────────────────────────────────────────────────────────────────

  const addToCart = async (productId, quantity = 1) => {
    dispatch({ type: 'CART_LOADING' });
    try {
      const { data } = await cartAPI.add(productId, quantity);
      dispatch({ type: 'CART_SUCCESS', payload: data.cart });
      toast.success('Added to cart');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add to cart';
      dispatch({ type: 'CART_ERROR', payload: msg });
      toast.error(msg);
      return { success: false };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const { data } = await cartAPI.update(productId, quantity);
      dispatch({ type: 'CART_SUCCESS', payload: data.cart });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update quantity');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const { data } = await cartAPI.remove(productId);
      dispatch({ type: 'CART_SUCCESS', payload: data.cart });
      toast.success('Item removed from cart');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      dispatch({ type: 'CLEAR_CART' });
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  // Derived values
  const cartItemCount = state.cart?.totalItems || 0;
  const cartTotal     = state.cart?.totalPrice || 0;

  return (
    <CartContext.Provider
      value={{
        ...state,
        cartItemCount,
        cartTotal,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ─── Hook ──────────────────────────────────────────────────────────────────────
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
