import React, { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiSave } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: { street: user?.address?.street || '', city: user?.address?.city || '', state: user?.address?.state || '', pincode: user?.address?.pincode || '' },
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.updateProfile(form);
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="page" data-cy="profile-page">
      <h1 className="page-title">My Profile</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem' }}>
        {/* Avatar Card */}
        <div className="card" style={{ padding: '2rem', textAlign: 'center', height: 'fit-content' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '2rem', color: 'white', fontWeight: 700 }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <h3 style={{ fontWeight: 700, marginBottom: '0.3rem' }}>{user?.name}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{user?.email}</p>
          <span className={`badge ${user?.role === 'admin' ? 'badge-danger' : 'badge-primary'}`}>{user?.role}</span>
        </div>

        {/* Form */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Edit Profile</h3>
          <form onSubmit={handleSubmit} data-cy="profile-form">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              <div className="form-group">
                <label className="form-label"><FiUser style={{ marginRight: 4 }} />Full Name</label>
                <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-cy="name-input" />
              </div>
              <div className="form-group">
                <label className="form-label"><FiMail style={{ marginRight: 4 }} />Email</label>
                <input className="form-input" value={user?.email} disabled style={{ opacity: 0.6 }} />
              </div>
              <div className="form-group">
                <label className="form-label"><FiPhone style={{ marginRight: 4 }} />Phone</label>
                <input className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} data-cy="phone-input" />
              </div>
            </div>
            <h4 style={{ fontWeight: 600, marginBottom: '1rem', marginTop: '0.5rem' }}><FiMapPin style={{ marginRight: 4 }} />Address</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              {['street', 'city', 'state', 'pincode'].map((f) => (
                <div key={f} className="form-group">
                  <label className="form-label" style={{ textTransform: 'capitalize' }}>{f}</label>
                  <input className="form-input" value={form.address[f]} onChange={(e) => setForm({ ...form, address: { ...form.address, [f]: e.target.value } })} data-cy={`${f}-input`} />
                </div>
              ))}
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} data-cy="save-profile-btn">
              <FiSave /> {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
