import React, { useState, useEffect } from 'react';
import { FiUsers, FiShoppingBag, FiPackage, FiDollarSign } from 'react-icons/fi';
import { adminAPI } from '../../utils/api';
import AdminLayout from './AdminLayout';

const statConfig = [
  { key: 'totalUsers', label: 'Total Users', icon: FiUsers, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  { key: 'totalProducts', label: 'Products', icon: FiShoppingBag, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  { key: 'totalOrders', label: 'Orders', icon: FiPackage, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  { key: 'totalRevenue', label: 'Revenue', icon: FiDollarSign, color: '#ef4444', bg: 'rgba(239,68,68,0.1)', prefix: '₹' },
];

const statusClass = { Pending: 'badge-warning', Processing: 'badge-primary', Shipped: 'badge-primary', Delivered: 'badge-success', Cancelled: 'badge-danger' };

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard()
      .then(({ data }) => { setStats(data.stats); setRecentOrders(data.recentOrders); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <h1 className="page-title">Dashboard</h1>
      {loading ? <div className="spinner" /> : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {statConfig.map(({ key, label, icon: Icon, color, bg, prefix }) => (
              <div key={key} className="stat-card" data-cy={`stat-${key}`}>
                <div className="stat-icon" style={{ background: bg, color }}><Icon /></div>
                <div>
                  <div className="stat-value">{prefix || ''}{key === 'totalRevenue' ? stats[key]?.toLocaleString() : stats[key]}</div>
                  <div className="stat-label">{label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Recent Orders</h3>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o._id} data-cy="recent-order-row">
                      <td style={{ fontWeight: 600 }}>#{o._id?.slice(-8).toUpperCase()}</td>
                      <td>{o.user?.name}</td>
                      <td style={{ fontWeight: 600, color: 'var(--primary)' }}>₹{o.totalPrice?.toLocaleString()}</td>
                      <td><span className={`badge ${statusClass[o.orderStatus]}`}>{o.orderStatus}</span></td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
