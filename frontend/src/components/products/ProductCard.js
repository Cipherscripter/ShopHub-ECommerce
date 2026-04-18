import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './ProductCard.css';

const StarRating = ({ rating }) => (
  <span className="star-rating">
    {[1,2,3,4,5].map(i => (
      <span key={i} style={{ color: i <= Math.round(rating) ? '#f59e0b' : '#d1d5db' }}>★</span>
    ))}
  </span>
);

const ProductCard = ({ product }) => {
  const { addToCart, loading } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { window.location.href = '/login'; return; }
    await addToCart(product._id, 1);
  };

  const discountPercent = product.discountPrice > 0
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-card-image-wrapper">
        <img
          src={product.images[0]?.url || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&q=80'}
          alt={product.name}
          className="product-card-image"
          loading="lazy"
        />
        {discountPercent > 0 && (
          <span className="product-discount-badge">-{discountPercent}%</span>
        )}
        {product.stock === 0 && (
          <div className="product-out-of-stock">Sold Out</div>
        )}
        {product.stock > 0 && (
          <button
            className="btn btn-primary btn-sm product-quick-add"
            onClick={handleAddToCart}
            disabled={loading}
            aria-label={`Add ${product.name} to cart`}
          >
            + Add to Cart
          </button>
        )}
      </div>

      <div className="product-card-body">
        <p className="product-category">{product.category}</p>
        <h3 className="product-name">{product.name}</h3>

        <div className="product-rating">
          <StarRating rating={product.rating} />
          <span className="product-review-count">({product.numReviews})</span>
        </div>

        <div className="product-price-row">
          <div className="product-prices">
            <span className="product-price">₹{displayPrice.toLocaleString('en-IN')}</span>
            {discountPercent > 0 && (
              <span className="product-original-price">₹{product.price.toLocaleString('en-IN')}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
