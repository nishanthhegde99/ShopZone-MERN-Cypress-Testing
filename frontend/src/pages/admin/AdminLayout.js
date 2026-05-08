import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiArrowLeft } from 'react-icons/fi';

const links = [
  { to: '/admin', icon: FiGrid, label: 'Dashboard' },
  { to: '/admin/products', icon: FiShoppingBag, label: 'Products' },
  { to: '/admin/orders', icon: FiPackage, label: 'Orders' },
  { to: '/admin/users', icon: FiUsers, label: 'Users' },
];

export default function AdminLayout({ children }) {
  const { pathname } = useLocation();
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div style={{ padding: '0 1.5rem 1.5rem', borderBottom: '1px solid var(--border)', marginBottom: '0.5rem' }}>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>Admin Panel</div>
        </div>
        {links.map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to} className={`admin-sidebar-link ${pathname === to ? 'active' : ''}`}>
            <Icon /> {label}
          </Link>
        ))}
        <Link to="/" className="admin-sidebar-link" style={{ marginTop: 'auto' }}><FiArrowLeft /> Back to Store</Link>
      </aside>
      <div className="admin-content">{children}</div>
    </div>
  );
}
