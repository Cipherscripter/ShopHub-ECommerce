import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">🛍️ ShopHub</Link>
          <p className="footer-tagline">Your premium online shopping destination.</p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h4>Shop</h4>
            <Link to="/products">All Products</Link>
            <Link to="/products?category=Electronics">Electronics</Link>
            <Link to="/products?category=Clothing">Clothing</Link>
            <Link to="/products?category=Books">Books</Link>
          </div>
          <div className="footer-col">
            <h4>Account</h4>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/orders">My Orders</Link>
            <Link to="/profile">Profile</Link>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <a href="#faq">FAQ</a>
            <a href="#shipping">Shipping Policy</a>
            <a href="#returns">Returns</a>
            <a href="#contact">Contact Us</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} ShopHub. All rights reserved.</p>
        <p>Built with React &amp; Node.js</p>
      </div>
    </footer>
  );
};

export default Footer;
