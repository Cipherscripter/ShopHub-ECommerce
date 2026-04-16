import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Spinner from '../components/common/Spinner';
import './ProductDetailPage.css';

const StarRating = ({ rating, interactive = false, onRate }) => {
  const [hovered, setHovered] = useState(0);
  const display = interactive ? (hovered || rating) : rating;

  return (
    <div className="star-row">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= display ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
          onClick={() => interactive && onRate && onRate(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          role={interactive ? 'button' : undefined}
          aria-label={interactive ? `Rate ${star} stars` : undefined}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, loading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [quantity, setQuantity]     = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await productAPI.getById(id);
        setProduct(data.product);
      } catch (err) {
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    await addToCart(product._id, quantity);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSubmittingReview(true);
    try {
      await productAPI.addReview(id, { rating: reviewRating, comment: reviewComment });
      toast.success('Review submitted!');
      setReviewComment('');
      // Refresh product to show new review
      const { data } = await productAPI.getById(id);
      setProduct(data.product);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <Spinner />;
  if (!product) return null;

  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const inStock = product.stock > 0;

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a> / <a href="/products">Products</a> / <span>{product.name}</span>
        </nav>

        {/* ─── Product Main ──────────────────────────────────────────────── */}
        <div className="product-detail-grid">
          {/* Images */}
          <div className="product-images">
            <div className="product-main-image">
              <img
                src={product.images[activeImage]?.url || 'https://via.placeholder.com/600x600'}
                alt={product.name}
              />
            </div>
            {product.images.length > 1 && (
              <div className="product-thumbnails">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`thumbnail ${activeImage === idx ? 'active' : ''}`}
                    onClick={() => setActiveImage(idx)}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img src={img.url} alt={`${product.name} ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-info">
            <span className="product-category-badge">{product.category}</span>
            <h1 className="product-detail-name">{product.name}</h1>

            <div className="product-detail-rating">
              <StarRating rating={product.rating} />
              <span>{product.rating} ({product.numReviews} reviews)</span>
            </div>

            <div className="product-detail-price">
              <span className="price-main">₹{displayPrice.toFixed(2)}</span>
              {product.discountPrice > 0 && (
                <span className="price-original">₹{product.price.toFixed(2)}</span>
              )}
            </div>

            <p className="product-detail-description">{product.description}</p>

            <div className="product-meta">
              <div className="meta-row">
                <span className="meta-label">Brand:</span>
                <span>{product.brand}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Availability:</span>
                <span className={inStock ? 'in-stock' : 'out-of-stock-text'}>
                  {inStock ? `✓ In Stock (${product.stock} left)` : '✗ Out of Stock'}
                </span>
              </div>
            </div>

            {inStock && (
              <div className="quantity-selector">
                <label className="form-label">Quantity</label>
                <div className="qty-controls">
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="qty-value">{quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="product-actions">
              <button
                className="btn btn-primary btn-lg btn-full"
                onClick={handleAddToCart}
                disabled={!inStock || cartLoading}
              >
                {cartLoading ? 'Adding...' : inStock ? '🛒 Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>

        {/* ─── Reviews ──────────────────────────────────────────────────── */}
        <section className="reviews-section">
          <h2 className="reviews-title">Customer Reviews</h2>

          {/* Write Review */}
          {isAuthenticated && (
            <form className="review-form card" onSubmit={handleSubmitReview}>
              <h3>Write a Review</h3>
              <div className="form-group">
                <label className="form-label">Your Rating</label>
                <StarRating
                  rating={reviewRating}
                  interactive
                  onRate={setReviewRating}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="review-comment">Comment</label>
                <textarea
                  id="review-comment"
                  className="form-control"
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submittingReview}
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}

          {/* Reviews List */}
          {product.reviews.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="reviews-list">
              {product.reviews.map((review) => (
                <div key={review._id} className="review-card card">
                  <div className="review-header">
                    <div>
                      <strong>{review.name}</strong>
                      <StarRating rating={review.rating} />
                    </div>
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProductDetailPage;
