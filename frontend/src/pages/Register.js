import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await register(form.name, form.email, form.password);
    if (result.success) navigate('/');
  };

  const field = (key, label, type, icon, placeholder, extra = {}) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>{icon}</span>
        <input type={type} className="form-input" style={{ paddingLeft: '2.5rem', ...extra.style }} placeholder={placeholder}
          value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} data-cy={`${key}-input`} />
        {extra.toggle}
      </div>
      {errors[key] && <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.3rem' }} data-cy={`${key}-error`}>{errors[key]}</p>}
    </div>
  );

  return (
    <div className="auth-page" data-cy="register-page">
      <div className="auth-card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join ShopZone and start shopping</p>
        <form onSubmit={handleSubmit} data-cy="register-form" noValidate>
          {field('name', 'Full Name', 'text', <FiUser />, 'John Doe')}
          {field('email', 'Email Address', 'email', <FiMail />, 'you@example.com')}
          {field('password', 'Password', showPass ? 'text' : 'password', <FiLock />, 'Min 6 characters', {
            style: { paddingRight: '2.5rem' },
            toggle: (
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            )
          })}
          {field('confirmPassword', 'Confirm Password', 'password', <FiLock />, 'Repeat password')}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.8rem' }} disabled={loading} data-cy="register-submit">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '1.2rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }} data-cy="login-link">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
