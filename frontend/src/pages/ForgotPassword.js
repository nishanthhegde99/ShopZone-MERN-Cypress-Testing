import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { toast.error('Enter your email'); return; }
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
      toast.success('Reset instructions sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" data-cy="forgot-password-page">
      <div className="auth-card">
        <h1 className="auth-title">Forgot Password</h1>
        <p className="auth-subtitle">Enter your email to receive reset instructions</p>
        {sent ? (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Check your email for password reset instructions.</p>
            <Link to="/login" className="btn btn-primary" style={{ justifyContent: 'center' }}>Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} data-cy="forgot-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="email" className="form-input" style={{ paddingLeft: '2.5rem' }} placeholder="you@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)} data-cy="email-input" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.8rem' }} disabled={loading} data-cy="submit-btn">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center', marginTop: '1rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>
              <FiArrowLeft /> Back to Login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
