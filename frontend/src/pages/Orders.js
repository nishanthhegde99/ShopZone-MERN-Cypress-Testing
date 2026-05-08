import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiEye } from 'react-icons/fi';
import { orderAPI } from '../utils/api';

const statusClass = { Pending: 'badge-warning', Processing: 'badge-primary', Shipped: 'badge-primary', Delivered: 'badge-success', Cancelled: 'badge-danger' };

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getMyOrders().then(({ data }) => setOrders(data.orders)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="page" data-cy="orders-page">
      <h1 className="page-title">My Orders</h1>
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <FiPackage style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3>No orders yet</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Start shopping to see your orders here</p>
          <Link to="/products" className="btn btn-primary">Shop Now</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map((order) => (
            <div key={order._id} className="card" style={{ padding: '1.2rem' }} data-cy="order-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: '0.3rem' }}>Order #{order._id?.slice(-8).toUpperCase()}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className={`badge ${statusClass[order.orderStatus] || 'badge-primary'}`} data-cy="order-status">{order.orderStatus}</span>
                  <span style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{order.totalPrice?.toLocaleString()}</span>
                  <Link to={`/orders/${order._id}`} className="btn btn-outline btn-sm" data-cy="view-order"><FiEye /> View</Link>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.8rem', flexWrap: 'wrap' }}>
                {order.orderItems?.slice(0, 3).map((item, i) => (
                  <div key={i} style={{ fontSize: '0.82rem', color: 'var(--text-muted)', background: 'var(--bg)', padding: '0.2rem 0.6rem', borderRadius: 20 }}>
                    {item.name} × {item.quantity}
                  </div>
                ))}
                {order.orderItems?.length > 3 && <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>+{order.orderItems.length - 3} more</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
