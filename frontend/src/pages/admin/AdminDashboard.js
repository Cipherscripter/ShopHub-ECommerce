import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI, userAPI, productAPI } from '../../services/api';
import Spinner from '../../components/common/Spinner';
import './Admin.css';

const StatCard = ({ title, value, icon, color, link }) => (
  <Link to={link} className="stat-card card">
    <div className="stat-icon" style={{ background: color }}>{icon}</div>
    <div className="stat-info">
      <p className="stat-value">{value}</p>
      <p className="stat-title">{title}</p>
    </div>
  </Link>
);

const AdminDashboard = () => {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, usersRes, productsRes] = await Promise.all([
          orderAPI.getAllOrders({ limit: 5 }),
          userAPI.getAll({ limit: 1 }),
          productAPI.getAll({ limit: 1 }),
        ]);

        setStats({
          totalOrders:   ordersRes.data.total,
          totalRevenue:  ordersRes.data.revenue,
          totalUsers:    usersRes.data.total,
          totalProducts: productsRes.data.total,
        });

        setRecentOrders(ordersRes.data.orders);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="admin-header">
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="admin-subtitle">Welcome back! Here's what's happening.</p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <StatCard
            title="Total Revenue"
            value={`₹${stats?.totalRevenue?.toFixed(2) || '0.00'}`}
            icon="💰"
            color="#dbeafe"
            link="/admin/orders"
          />
          <StatCard
            title="Total Orders"
            value={stats?.totalOrders || 0}
            icon="📦"
            color="#d1fae5"
            link="/admin/orders"
          />
          <StatCard
            title="Total Products"
            value={stats?.totalProducts || 0}
            icon="🛍️"
            color="#fef3c7"
            link="/admin/products"
          />
          <StatCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon="👥"
            color="#ede9fe"
            link="/admin/users"
          />
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/admin/products/new" className="btn btn-primary">+ Add Product</Link>
            <Link to="/admin/orders"       className="btn btn-secondary">View Orders</Link>
            <Link to="/admin/users"        className="btn btn-secondary">Manage Users</Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="recent-orders">
          <div className="section-header">
            <h2>Recent Orders</h2>
            <Link to="/admin/orders" className="btn btn-secondary btn-sm">View All</Link>
          </div>

          <div className="card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="mono">#{order._id.slice(-8).toUpperCase()}</td>
                    <td>{order.user?.name || 'N/A'}</td>
                    <td>₹{order.totalPrice.toFixed(2)}</td>
                    <td>
                      <span className={`badge badge-${order.orderStatus === 'delivered' ? 'success' : order.orderStatus === 'cancelled' ? 'danger' : 'warning'}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Link to={`/orders/${order._id}`} className="btn btn-secondary btn-sm">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
