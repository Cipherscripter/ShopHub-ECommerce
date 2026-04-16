import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ProfilePage from './pages/ProfilePage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';

import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/"                  element={<HomePage />} />
          <Route path="/products"          element={<ProductsPage />} />
          <Route path="/products/:id"      element={<ProductDetailPage />} />
          <Route path="/login"             element={<LoginPage />} />
          <Route path="/register"          element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/cart"            element={<CartPage />} />
            <Route path="/checkout"        element={<CheckoutPage />} />
            <Route path="/orders"          element={<OrdersPage />} />
            <Route path="/orders/:id"      element={<OrderDetailPage />} />
            <Route path="/profile"         element={<ProfilePage />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin"                    element={<AdminDashboard />} />
            <Route path="/admin/products"           element={<AdminProducts />} />
            <Route path="/admin/products/new"       element={<AdminProductForm />} />
            <Route path="/admin/products/:id/edit"  element={<AdminProductForm />} />
            <Route path="/admin/orders"             element={<AdminOrders />} />
            <Route path="/admin/users"              element={<AdminUsers />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
