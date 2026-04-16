import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI, paymentAPI } from '../services/api';
import { toast } from 'react-toastify';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { cart, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    fullName:   '',
    address:    '',
    city:       '',
    postalCode: '',
    country:    '',
    phone:      '',
  });

  const [paymentMethod, setPaymentMethod] = useState('mock');

  const items = cart?.items || [];
  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const shippingCost = cartTotal >= 999 ? 0 : 99;
  const tax          = parseFloat((cartTotal * 0.18).toFixed(2));
  const orderTotal   = parseFloat((cartTotal + shippingCost + tax).toFixed(2));

  const handleChange = (e) => {
    setShippingAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order
      const { data } = await orderAPI.create({ shippingAddress, paymentMethod });
      const orderId = data.order._id;

      // Process payment
      if (paymentMethod === 'mock') {
        await paymentAPI.mockPay(orderId);
        toast.success('Order placed successfully!');
        clearCart();
        navigate(`/orders/${orderId}`);
      } else if (paymentMethod === 'stripe') {
        // In production, redirect to Stripe checkout or use Stripe Elements
        toast.info('Stripe integration: redirect to payment page');
        // For now, just navigate to order
        navigate(`/orders/${orderId}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 className="page-title">Checkout</h1>

        <div className="checkout-layout">
          {/* ─── Shipping Form ──────────────────────────────────────── */}
          <form className="checkout-form" onSubmit={handleSubmit}>
            <section className="form-section card">
              <h2>Shipping Address</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="fullName">Full Name *</label>
                  <input
                    id="fullName"
                    name="fullName"
                    className="form-control"
                    value={shippingAddress.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Phone Number *</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="form-control"
                    value={shippingAddress.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label" htmlFor="address">Street Address *</label>
                  <input
                    id="address"
                    name="address"
                    className="form-control"
                    value={shippingAddress.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="city">City *</label>
                  <input
                    id="city"
                    name="city"
                    className="form-control"
                    value={shippingAddress.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="postalCode">Postal Code *</label>
                  <input
                    id="postalCode"
                    name="postalCode"
                    className="form-control"
                    value={shippingAddress.postalCode}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label" htmlFor="country">Country *</label>
                  <input
                    id="country"
                    name="country"
                    className="form-control"
                    value={shippingAddress.country}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </section>

            <section className="form-section card">
              <h2>Payment Method</h2>
              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="mock"
                    checked={paymentMethod === 'mock'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>💳 Mock Payment (Demo)</span>
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="stripe"
                    checked={paymentMethod === 'stripe'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>💳 Stripe (Credit Card)</span>
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>💵 Cash on Delivery</span>
                </label>
              </div>
            </section>

            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
            >
              {loading ? 'Processing...' : `Place Order - ₹${orderTotal.toFixed(2)}`}
            </button>
          </form>

          {/* ─── Order Summary ──────────────────────────────────────── */}
          <div className="checkout-summary card">
            <h2>Order Summary</h2>

            <div className="summary-items">
              {items.map((item) => (
                <div key={item._id} className="summary-item">
                  <img
                    src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/60'}
                    alt={item.product?.name}
                  />
                  <div className="summary-item-info">
                    <p className="summary-item-name">{item.product?.name}</p>
                    <p className="summary-item-qty">Qty: {item.quantity}</p>
                  </div>
                  <span className="summary-item-price">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="summary-row">
                <span>Tax (18% GST)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>₹{orderTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
