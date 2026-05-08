import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiTruck, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { orderAPI } from '../utils/api';
import toast from 'react-hot-toast';

const TRACKING_STEPS = ['Pending', 'Processing', 'Shipped', 'Delivered'];

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getOne(id).then(({ data }) => setOrder(data.order)).catch(() => navigate('/orders')).finally(() => setLoading(false));
  }, [id, navigate]);

  const handleCancel = async () => {
    try {
      const { data } = await orderAPI.cancel(id);
      setOrder(data.order);
      toast.success('Order cancelled');
    } catch (err) { toast.error(err.response?.data?.message || 'Cannot cancel'); }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!order) return null;

  const currentStep = TRACKING_STEPS.indexOf(order.orderStatus);

  return (
    <div className="page" data-cy="order-detail-page">
      <button onClick={() => navigate('/orders')} className="btn btn-outline btn-sm" style={{ marginBottom: '1.5rem' }}>
        <FiArrowLeft /> Back to Orders
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '0.2rem' }}>Order #{order._id?.slice(-8).toUpperCase()}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        {['Pending', 'Processing'].includes(order.orderStatus) && (
          <button className="btn btn-danger" onClick={handleCancel} data-cy="cancel-order-btn">Cancel Order</button>
        )}
      </div>

      {/* Tracking */}
      {order.orderStatus !== 'Cancelled' && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Order Tracking</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 16, left: '12.5%', right: '12.5%', height: 3, background: 'var(--border)', zIndex: 0 }}>
              <div style={{ height: '100%', background: 'var(--primary)', width: `${(currentStep / (TRACKING_STEPS.length - 1)) * 100}%`, transition: 'width 0.5s' }} />
            </div>
            {TRACKING_STEPS.map((s, i) => (
              <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', zIndex: 1 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: i <= currentStep ? 'var(--primary)' : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1rem', transition: 'background 0.3s' }}>
                  {i < currentStep ? <FiCheckCircle /> : i === 0 ? <FiPackage /> : i === 2 ? <FiTruck /> : <FiCheckCircle />}
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: i === currentStep ? 700 : 400, color: i <= currentStep ? 'var(--primary)' : 'var(--text-muted)' }}>{s}</span>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Tracking: {order.trackingNumber}</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
        {/* Items */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Order Items</h3>
          {order.orderItems?.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', padding: '0.8rem 0', borderBottom: '1px solid var(--border)' }}>
              <img src={item.image || 'https://via.placeholder.com/60'} alt={item.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{item.name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</div>
              </div>
              <div style={{ fontWeight: 700 }}>₹{(item.price * item.quantity)?.toLocaleString()}</div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card" style={{ padding: '1.2rem' }}>
            <h4 style={{ fontWeight: 700, marginBottom: '0.8rem' }}>Shipping Address</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
              {order.shippingAddress?.fullName}<br />
              {order.shippingAddress?.street}<br />
              {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
            </p>
          </div>
          <div className="card" style={{ padding: '1.2rem' }}>
            <h4 style={{ fontWeight: 700, marginBottom: '0.8rem' }}>Payment</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{order.paymentMethod}</p>
            <span className={`badge ${order.isPaid ? 'badge-success' : 'badge-warning'}`}>{order.isPaid ? 'Paid' : 'Pending'}</span>
          </div>
          <div className="card" style={{ padding: '1.2rem' }}>
            <h4 style={{ fontWeight: 700, marginBottom: '0.8rem' }}>Price Details</h4>
            {[['Items', `₹${order.itemsPrice?.toLocaleString()}`], ['Shipping', order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`], ['Tax', `₹${order.taxPrice?.toLocaleString()}`]].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                <span>{l}</span><span>{v}</span>
              </div>
            ))}
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0.8rem 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
              <span>Total</span><span style={{ color: 'var(--primary)' }}>₹{order.totalPrice?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
