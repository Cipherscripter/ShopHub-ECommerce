import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartItemCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          Shop<span>Hub</span>
        </Link>

        {/* Search Bar */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="navbar-search-input"
            aria-label="Search products"
          />
          <button type="submit" className="navbar-search-btn" aria-label="Submit search">
            🔍
          </button>
        </form>

        {/* Desktop Nav Links */}
        <div className="navbar-links">
          <Link to="/products" className="nav-link">Products</Link>

          {isAuthenticated ? (
            <>
              <Link to="/cart" className="nav-link cart-link" aria-label={`Cart with ${cartItemCount} items`}>
                🛒
                {cartItemCount > 0 && (
                  <span className="cart-badge">{cartItemCount > 99 ? '99+' : cartItemCount}</span>
                )}
              </Link>

              <div className="nav-dropdown">
                <button className="nav-link dropdown-trigger">
                  {user?.name?.split(' ')[0]} ▾
                </button>
                <div className="dropdown-menu">
                  <Link to="/profile"  className="dropdown-item">My Profile</Link>
                  <Link to="/orders"   className="dropdown-item">My Orders</Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="dropdown-item admin-link">Admin Dashboard</Link>
                  )}
                  <hr className="dropdown-divider" />
                  <button onClick={handleLogout} className="dropdown-item logout-btn">
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login"    className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <form className="mobile-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
            />
            <button type="submit" className="btn btn-primary btn-sm">Search</button>
          </form>

          <Link to="/products" className="mobile-link" onClick={() => setMenuOpen(false)}>Products</Link>

          {isAuthenticated ? (
            <>
              <Link to="/cart"    className="mobile-link" onClick={() => setMenuOpen(false)}>
                Cart {cartItemCount > 0 && `(${cartItemCount})`}
              </Link>
              <Link to="/orders"  className="mobile-link" onClick={() => setMenuOpen(false)}>My Orders</Link>
              <Link to="/profile" className="mobile-link" onClick={() => setMenuOpen(false)}>Profile</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="mobile-link" onClick={() => setMenuOpen(false)}>Admin</Link>
              )}
              <button onClick={handleLogout} className="mobile-link mobile-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"    className="mobile-link" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="mobile-link" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
