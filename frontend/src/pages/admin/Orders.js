import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import AdminLayout from './AdminLayout';
import toast from 'react-hot-toast';

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const statusClass = { Pending: 'badge-warning', Processing: 'badge-primary', Shipped: 'badge-primary', Delivered: 'badge-success', Cancelled: 'badge-danger' };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getOrders().then(({ data }) => setOrders(data.orders)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const { data } = await adminAPI.updateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => o._id === id ? data.order : o));
      toast.success('Status updated');
    } catch { toast.error('Update failed'); }
  };

  return (
    <AdminLayout>
      <h1 className="page-title">Orders ({orders.length})</h1>
      {loading ? <div className="spinner" /> : (
        <div className="card table-wrap">
          <table>
            <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} data-cy="admin-order-row">
                  <td style={{ fontWeight: 600 }}>#{o._id?.slice(-8).toUpperCase()}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{o.user?.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{o.user?.email}</div>
                  </td>
                  <td>{o.orderItems?.length} items</td>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{o.totalPrice?.toLocaleString()}</td>
                  <td>
                    <div>{o.paymentMethod}</div>
                    <span className={`badge ${o.isPaid ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.7rem' }}>{o.isPaid ? 'Paid' : 'Unpaid'}</span>
                  </td>
                  <td>
                    <select value={o.orderStatus} onChange={(e) => handleStatusChange(o._id, e.target.value)}
                      className="form-input" style={{ padding: '0.3rem 0.6rem', fontSize: '0.82rem', width: 'auto' }} data-cy="status-select">
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
