import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import Spinner from '../components/common/Spinner';
import './OrderDetailPage.css';

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];

const STATUS_COLORS = {
  pending:    'badge-warning',
  processing: 'badge-primary',
  shipped:    'badge-primary',
  delivered:  'badge-success',
  cancelled:  'badge-danger',
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await orderAPI.getById(id);
        setOrder(data.order);
      } catch (err) {
        console.error('Failed to fetch order:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <Spinner />;
  if (!order) return <div className="container"><p>Order not found.</p></div>;

  const currentStep = STATUS_STEPS.indexOf(order.orderStatus);

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="order-detail-header">
          <div>
            <h1 className="page-title">Order Details</h1>
            <p className="order-detail-id">#{order._id.slice(-8).toUpperCase()}</p>
          </div>
          <span className={`badge ${STATUS_COLORS[order.orderStatus] || 'badge-gray'}`} style={{ fontSize: '0.875rem', padding: '0.375rem 0.875rem' }}>
            {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
          </span>
        </div>

        {/* ─── Progress Tracker ──────────────────────────────────────── */}
        {order.orderStatus !== 'cancelled' && (
          <div className="order-progress card">
            <div className="progress-steps">
              {STATUS_STEPS.map((step, idx) => (
                <div
                  key={step}
                  className={`progress-step ${idx <= currentStep ? 'completed' : ''} ${idx === currentStep ? 'active' : ''}`}
                >
                  <div className="step-circle">{idx < currentStep ? '✓' : idx + 1}</div>
                  <span className="step-label">{step.charAt(0).toUpperCase() + step.slice(1)}</span>
                  {idx < STATUS_STEPS.length - 1 && (
                    <div className={`step-line ${idx < currentStep ? 'completed' : ''}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="order-detail-grid">
          {/* ─── Left Column ──────────────────────────────────────────── */}
          <div className="order-detail-left">
            {/* Items */}
            <section className="card order-section">
              <h2>Items Ordered</h2>
              {order.orderItems.map((item, idx) => (
                <div key={idx} className="order-detail-item">
                  <img src={item.image} alt={item.name} />
                  <div className="order-detail-item-info">
                    <p className="order-detail-item-name">{item.name}</p>
                    <p className="order-detail-item-qty">Qty: {item.quantity}</p>
                  </div>
                  <span className="order-detail-item-price">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </section>

            {/* Shipping */}
            <section className="card order-section">
              <h2>Shipping Address</h2>
              <div className="address-block">
                <p><strong>{order.shippingAddress.fullName}</strong></p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
                <p>📞 {order.shippingAddress.phone}</p>
              </div>
              {order.trackingNumber && (
                <p className="tracking-number">
                  Tracking: <strong>{order.trackingNumber}</strong>
                </p>
              )}
            </section>
          </div>

          {/* ─── Right Column ─────────────────────────────────────────── */}
          <div className="order-detail-right">
            {/* Payment Summary */}
            <section className="card order-section">
              <h2>Payment Summary</h2>
              <div className="payment-summary">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{order.itemsPrice.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice.toFixed(2)}`}</span>
                </div>
                <div className="summary-row">
                  <span>Tax (18% GST)</span>
                  <span>₹{order.taxPrice.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="summary-row discount">
                    <span>Discount</span>
                    <span>-₹{order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="summary-total">
                  <span>Total</span>
                  <span>₹{order.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="payment-status">
                <span>Payment:</span>
                <span className={order.isPaid ? 'paid' : 'unpaid'}>
                  {order.isPaid
                    ? `✓ Paid on ${new Date(order.paidAt).toLocaleDateString()}`
                    : '✗ Not Paid'}
                </span>
              </div>

              <div className="payment-method">
                <span>Method:</span>
                <span>{order.paymentMethod.toUpperCase()}</span>
              </div>
            </section>

            {/* Status History */}
            {order.statusHistory?.length > 0 && (
              <section className="card order-section">
                <h2>Status History</h2>
                <div className="status-history">
                  {order.statusHistory.map((entry, idx) => (
                    <div key={idx} className="history-entry">
                      <span className={`badge ${STATUS_COLORS[entry.status] || 'badge-gray'}`}>
                        {entry.status}
                      </span>
                      <span className="history-date">
                        {new Date(entry.updatedAt).toLocaleString()}
                      </span>
                      {entry.note && <p className="history-note">{entry.note}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        <Link to="/orders" className="btn btn-secondary" style={{ marginTop: '1.5rem' }}>
          ← Back to Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderDetailPage;
