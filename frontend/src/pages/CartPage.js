import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Spinner from '../components/common/Spinner';
import './CartPage.css';

const CartPage = () => {
  const { cart, loading, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();

  if (loading) return <Spinner />;

  const items = cart?.items || [];
  const isEmpty = items.length === 0;

  const shippingCost = cartTotal >= 999 ? 0 : 99;
  const tax          = parseFloat((cartTotal * 0.18).toFixed(2));
  const orderTotal   = parseFloat((cartTotal + shippingCost + tax).toFixed(2));

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 className="page-title">Shopping Cart</h1>

        {isEmpty ? (
          <div className="empty-cart">
            <span className="empty-cart-icon">🛒</span>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet.</p>
            <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
          </div>
        ) : (
          <div className="cart-layout">
            {/* ─── Cart Items ─────────────────────────────────────────── */}
            <div className="cart-items">
              <div className="cart-header">
                <span>{items.length} item{items.length !== 1 ? 's' : ''}</span>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>
              </div>

              {items.map((item) => {
                const product = item.product;
                if (!product) return null;

                return (
                  <div key={item._id} className="cart-item card">
                    <Link to={`/products/${product._id}`} className="cart-item-image">
                      <img
                        src={product.images?.[0]?.url || 'https://via.placeholder.com/100'}
                        alt={product.name}
                      />
                    </Link>

                    <div className="cart-item-details">
                      <Link to={`/products/${product._id}`} className="cart-item-name">
                        {product.name}
                      </Link>
                      <p className="cart-item-price">₹{item.price.toFixed(2)} each</p>

                      {product.stock < 5 && product.stock > 0 && (
                        <p className="low-stock-warning">Only {product.stock} left!</p>
                      )}
                    </div>

                    <div className="cart-item-qty">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(product._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(product._id, item.quantity + 1)}
                        disabled={item.quantity >= product.stock}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div className="cart-item-subtotal">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>

                    <button
                      className="cart-item-remove"
                      onClick={() => removeFromCart(product._id)}
                      aria-label={`Remove ${product.name} from cart`}
                    >
                      🗑️
                    </button>
                  </div>
                );
              })}
            </div>

            {/* ─── Order Summary ──────────────────────────────────────── */}
            <div className="order-summary card">
              <h2 className="summary-title">Order Summary</h2>

              <div className="summary-rows">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? <span className="free-shipping">FREE</span> : `₹${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="summary-row">
                  <span>Tax (18% GST)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                {shippingCost > 0 && (
                  <p className="shipping-note">
                    Add ₹{(999 - cartTotal).toFixed(2)} more for free shipping!
                  </p>
                )}
              </div>

              <div className="summary-total">
                <span>Total</span>
                <span>₹{orderTotal.toFixed(2)}</span>
              </div>

              <button
                className="btn btn-primary btn-full btn-lg"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout →
              </button>

              <Link to="/products" className="btn btn-secondary btn-full" style={{ marginTop: '0.75rem' }}>
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
