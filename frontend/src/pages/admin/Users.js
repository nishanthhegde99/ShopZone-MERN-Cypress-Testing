import React, { useState, useEffect } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { adminAPI } from '../../utils/api';
import AdminLayout from './AdminLayout';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getUsers().then(({ data }) => setUsers(data.users)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try { await adminAPI.deleteUser(id); setUsers((prev) => prev.filter((u) => u._id !== id)); toast.success('User deleted'); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <AdminLayout>
      <h1 className="page-title">Users ({users.length})</h1>
      {loading ? <div className="spinner" /> : (
        <div className="card table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} data-cy="user-row">
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                  <td><span className={`badge ${u.role === 'admin' ? 'badge-danger' : 'badge-primary'}`}>{u.role}</span></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    {u.role !== 'admin' && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u._id)} data-cy="delete-user-btn"><FiTrash2 /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
