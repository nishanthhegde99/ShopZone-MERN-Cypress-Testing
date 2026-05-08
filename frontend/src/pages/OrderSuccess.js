import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiPackage } from 'react-icons/fi';
import { orderAPI } from '../utils/api';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    orderAPI.getOne(id).then(({ data }) => setOrder(data.order)).catch(() => {});
  }, [id]);

  return (
    <div className="page" style={{ textAlign: 'center', padding: '4rem 1.5rem' }} data-cy="order-success-page">
      <div style={{ fontSize: '4rem', color: 'var(--success)', marginBottom: '1rem' }}><FiCheckCircle /></div>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Order Placed Successfully!</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Thank you for shopping with ShopZone</p>
      {order && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.5rem', maxWidth: 400, margin: '2rem auto', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Order ID</span>
            <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>#{order._id?.slice(-8).toUpperCase()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Total</span>
            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{order.totalPrice?.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Payment</span>
            <span>{order.paymentMethod}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Tracking</span>
            <span style={{ fontWeight: 600 }}>{order.trackingNumber}</span>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to={`/orders/${id}`} className="btn btn-primary btn-lg"><FiPackage /> Track Order</Link>
        <Link to="/products" className="btn btn-outline btn-lg">Continue Shopping</Link>
      </div>
    </div>
  );
}
