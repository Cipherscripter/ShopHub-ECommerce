import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/products/ProductCard';
import Spinner from '../components/common/Spinner';
import './HomePage.css';

const CATEGORIES = [
  { name: 'Electronics', icon: '💻' },
  { name: 'Clothing',    icon: '👕' },
  { name: 'Books',       icon: '📚' },
  { name: 'Sports',      icon: '⚽' },
  { name: 'Home & Garden', icon: '🏡' },
  { name: 'Beauty',      icon: '💄' },
];

const HomePage = () => {
  const [featured, setFeatured]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await productAPI.getFeatured();
        setFeatured(data.products);
      } catch (err) {
        console.error('Failed to fetch featured products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="home-page">
      {/* ─── Hero Section ─────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="container hero-content">
          <h1 className="hero-title">
            Shop Smarter,<br />
            <span className="hero-highlight">Live Better</span>
          </h1>
          <p className="hero-subtitle">
            Discover thousands of products at unbeatable prices. Free shipping on orders over ₹999.
          </p>

          <form className="hero-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="What are you looking for?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="hero-search-input"
              aria-label="Search products"
            />
            <button type="submit" className="btn btn-primary btn-lg">
              🔍 Search
            </button>
          </form>

          <div className="hero-stats">
            <div className="hero-stat"><strong>10K+</strong><span>Products</span></div>
            <div className="hero-stat"><strong>50K+</strong><span>Customers</span></div>
            <div className="hero-stat"><strong>4.8★</strong><span>Rating</span></div>
          </div>
        </div>
      </section>

      {/* ─── Categories ───────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="category-card"
              >
                <span className="category-icon">{cat.icon}</span>
                <span className="category-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Products ─────────────────────────────────────────────── */}
      <section className="section section-gray">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <Link to="/products" className="btn btn-secondary">View All →</Link>
          </div>

          {loading ? (
            <Spinner />
          ) : featured.length > 0 ? (
            <div className="grid-products">
              {featured.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p className="empty-state">No featured products yet.</p>
          )}
        </div>
      </section>

      {/* ─── Value Props ───────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="value-props">
            <div className="value-prop">
              <span className="value-icon">🚚</span>
              <h3>Free Shipping</h3>
              <p>On all orders over $100</p>
            </div>
            <div className="value-prop">
              <span className="value-icon">🔒</span>
              <h3>Secure Payment</h3>
              <p>100% secure transactions</p>
            </div>
            <div className="value-prop">
              <span className="value-icon">↩️</span>
              <h3>Easy Returns</h3>
              <p>30-day return policy</p>
            </div>
            <div className="value-prop">
              <span className="value-icon">💬</span>
              <h3>24/7 Support</h3>
              <p>Always here to help</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
