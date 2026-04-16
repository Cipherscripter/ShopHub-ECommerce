import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './ProductCard.css';

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} style={{ color: i <= Math.round(rating) ? '#f59e0b' : '#d1d5db' }}>
        ★
      </span>
    );
  }
  return <span className="star-rating">{stars}</span>;
};

const ProductCard = ({ product }) => {
  const { addToCart, loading } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Don't navigate to product page
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    await addToCart(product._id, 1);
  };

  const discountPercent =
    product.discountPrice > 0
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : 0;

  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-card-image-wrapper">
        <img
          src={product.images[0]?.url || 'https://via.placeholder.com/400x400?text=No+Image'}
          alt={product.name}
          className="product-card-image"
          loading="lazy"
        />
        {discountPercent > 0 && (
          <span className="product-discount-badge">-{discountPercent}%</span>
        )}
        {product.stock === 0 && (
          <div className="product-out-of-stock">Out of Stock</div>
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
            <span className="product-price">₹{displayPrice.toFixed(2)}</span>
            {discountPercent > 0 && (
              <span className="product-original-price">₹{product.price.toFixed(2)}</span>
            )}
          </div>

          <button
            className="btn btn-primary btn-sm add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={loading || product.stock === 0}
            aria-label={`Add ${product.name} to cart`}
          >
            {product.stock === 0 ? 'Sold Out' : '+ Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
