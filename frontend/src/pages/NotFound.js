import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
      <div style={{ fontSize: '6rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>404</div>
      <h2 style={{ fontSize: '1.5rem', margin: '1rem 0 0.5rem' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary btn-lg">Go Home</Link>
    </div>
  );
}
