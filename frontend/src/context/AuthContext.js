import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

// ─── Reducer ───────────────────────────────────────────────────────────────────
const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_LOADING':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return { ...state, loading: false, user: action.payload, isAuthenticated: true, error: null };
    case 'AUTH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      return { ...initialState, loading: false };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
};

const initialState = {
  user:            null,
  isAuthenticated: false,
  loading:         true, // true on mount while we check localStorage
  error:           null,
};

// ─── Provider ──────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Rehydrate from localStorage on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user  = localStorage.getItem('user');

    if (token && user) {
      dispatch({ type: 'AUTH_SUCCESS', payload: JSON.parse(user) });
    } else {
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  // ─── Actions ────────────────────────────────────────────────────────────────

  const register = async (formData) => {
    dispatch({ type: 'AUTH_LOADING' });
    try {
      const { data } = await authAPI.register(formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      dispatch({ type: 'AUTH_SUCCESS', payload: data.user });
      toast.success(`Welcome, ${data.user.name}!`);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      dispatch({ type: 'AUTH_ERROR', payload: msg });
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const login = async (formData) => {
    dispatch({ type: 'AUTH_LOADING' });
    try {
      const { data } = await authAPI.login(formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      dispatch({ type: 'AUTH_SUCCESS', payload: data.user });
      toast.success(`Welcome back, ${data.user.name}!`);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      dispatch({ type: 'AUTH_ERROR', payload: msg });
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
    toast.info('Logged out successfully');
  };

  const updateUser = (userData) => {
    const updated = { ...state.user, ...userData };
    localStorage.setItem('user', JSON.stringify(updated));
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        register,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ──────────────────────────────────────────────────────────────────────
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
