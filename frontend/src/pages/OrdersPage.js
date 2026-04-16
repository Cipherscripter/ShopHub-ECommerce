import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import Spinner from '../components/common/Spinner';
import Pagination from '../components/common/Pagination';
import './OrdersPage.css';

const STATUS_COLORS = {
  pending:    'badge-warning',
  processing: 'badge-primary',
  shipped:    'badge-primary',
  delivered:  'badge-success',
  cancelled:  'badge-danger',
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage]   = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data } = await orderAPI.getMyOrders({ page, limit: 10 });
        setOrders(data.orders);
        setPages(data.pages);
        setTotal(data.total);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [page]);

  if (loading) return <Spinner />;

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 className="page-title">My Orders ({total})</h1>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <span>📦</span>
            <h2>No orders yet</h2>
            <p>When you place an order, it will appear here.</p>
            <Link to="/products" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <>
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order._id} className="order-card card">
                  <div className="order-card-header">
                    <div>
                      <p className="order-id">Order #{order._id.slice(-8).toUpperCase()}</p>
                      <p className="order-date">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric',
                        })}
                      </p>
                    </div>
                    <span className={`badge ${STATUS_COLORS[order.orderStatus] || 'badge-gray'}`}>
                      {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    </span>
                  </div>

                  <div className="order-items-preview">
                    {order.orderItems.slice(0, 3).map((item, idx) => (
                      <img
                        key={idx}
                        src={item.image || 'https://via.placeholder.com/60'}
                        alt={item.name}
                        className="order-item-thumb"
                        title={item.name}
                      />
                    ))}
                    {order.orderItems.length > 3 && (
                      <span className="more-items">+{order.orderItems.length - 3}</span>
                    )}
                  </div>

                  <div className="order-card-footer">
                    <div className="order-meta">
                      <span>{order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}</span>
                      <span className="order-total">₹{order.totalPrice.toFixed(2)}</span>
                    </div>
                    <Link to={`/orders/${order._id}`} className="btn btn-secondary btn-sm">
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <Pagination currentPage={page} totalPages={pages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
