import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/products/ProductCard';
import Spinner from '../components/common/Spinner';
import './HomePage.css';

const CATEGORIES = [
  { name: 'Electronics', icon: '💻', color: '#eff6ff', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80' },
  { name: 'Clothing',    icon: '👕', color: '#fdf4ff', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80' },
  { name: 'Books',       icon: '📚', color: '#fff7ed', img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80' },
  { name: 'Sports',      icon: '⚽', color: '#f0fdf4', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80' },
  { name: 'Home & Garden', icon: '🏡', color: '#fefce8', img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80' },
  { name: 'Beauty',      icon: '💄', color: '#fff1f2', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80' },
];

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    productAPI.getFeatured()
      .then(({ data }) => setFeatured(data.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="home-page">

      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="container hero-container">
          <div className="hero-text">
            <span className="hero-eyebrow">New Collection 2025</span>
            <h1 className="hero-title">
              Discover Products<br />
              <span className="hero-accent">You'll Love</span>
            </h1>
            <p className="hero-desc">
              Shop thousands of premium products across every category.
              Free shipping on orders over ₹999.
            </p>

            <form className="hero-search" onSubmit={handleSearch}>
              <span className="hero-search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search for products, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="hero-search-input"
              />
              <button type="submit" className="btn btn-primary">Search</button>
            </form>

            <div className="hero-tags">
              {['Earbuds', 'Sneakers', 'Skincare', 'Books'].map(tag => (
                <Link key={tag} to={`/products?keyword=${tag}`} className="hero-tag">{tag}</Link>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-img-main">
              <img src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80" alt="Featured product" />
            </div>
            <div className="hero-img-float hero-img-float-1">
              <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80" alt="Watch" />
            </div>
            <div className="hero-img-float hero-img-float-2">
              <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80" alt="Shoes" />
            </div>
            <div className="hero-badge-float">
              <span className="hero-badge-icon">⭐</span>
              <div>
                <p className="hero-badge-val">4.9/5</p>
                <p className="hero-badge-label">50K+ Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ────────────────────────────────────────────────────── */}
      <div className="stats-bar">
        <div className="container stats-inner">
          <div className="stat-item"><strong>10K+</strong><span>Products</span></div>
          <div className="stat-divider" />
          <div className="stat-item"><strong>50K+</strong><span>Happy Customers</span></div>
          <div className="stat-divider" />
          <div className="stat-item"><strong>Free</strong><span>Shipping ₹999+</span></div>
          <div className="stat-divider" />
          <div className="stat-item"><strong>24/7</strong><span>Support</span></div>
        </div>
      </div>

      {/* ─── Categories ───────────────────────────────────────────────────── */}
      <section className="section section-gray">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Shop by Category</h2>
              <p className="section-subtitle">Find exactly what you're looking for</p>
            </div>
            <Link to="/products" className="btn btn-secondary btn-sm">View All</Link>
          </div>

          <div className="categories-grid">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="category-card"
                style={{ '--cat-color': cat.color }}
              >
                <div className="category-img-wrap">
                  <img src={cat.img} alt={cat.name} />
                </div>
                <div className="category-info">
                  <span className="category-icon">{cat.icon}</span>
                  <span className="category-name">{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Products ─────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="section-subtitle">Handpicked just for you</p>
            </div>
            <Link to="/products" className="btn btn-secondary btn-sm">See All →</Link>
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
            <p style={{ color: 'var(--gray-500)', textAlign: 'center', padding: '3rem' }}>
              No featured products yet.
            </p>
          )}
        </div>
      </section>

      {/* ─── Promo Banner ─────────────────────────────────────────────────── */}
      <section className="promo-banner">
        <div className="container promo-inner">
          <div className="promo-text">
            <span className="promo-eyebrow">Limited Time Offer</span>
            <h2 className="promo-title">Get 20% Off Your First Order</h2>
            <p className="promo-desc">Sign up today and unlock exclusive deals on premium products.</p>
            <Link to="/register" className="btn btn-primary btn-lg">Claim Offer →</Link>
          </div>
          <div className="promo-img">
            <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80" alt="Shopping" />
          </div>
        </div>
      </section>

      {/* ─── Value Props ───────────────────────────────────────────────────── */}
      <section className="section section-gray">
        <div className="container">
          <div className="value-props">
            {[
              { icon: '🚚', title: 'Free Shipping', desc: 'On all orders over ₹999' },
              { icon: '🔒', title: 'Secure Payment', desc: '100% protected transactions' },
              { icon: '↩️', title: 'Easy Returns', desc: '30-day hassle-free returns' },
              { icon: '💬', title: '24/7 Support', desc: 'Always here to help you' },
            ].map((v) => (
              <div key={v.title} className="value-prop">
                <div className="value-icon-wrap">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
