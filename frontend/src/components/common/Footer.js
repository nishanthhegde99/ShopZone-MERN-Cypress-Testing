import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand">ShopZone</div>
          <p className="footer-desc">Your premium online shopping destination. Quality products, fast delivery, and excellent customer service.</p>
          <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
            {[FiFacebook, FiTwitter, FiInstagram, FiLinkedin].map((Icon, i) => (
              <a key={i} href="#" style={{ color: 'var(--text-muted)', fontSize: '1.2rem', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--primary)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}><Icon /></a>
            ))}
          </div>
        </div>
        <div>
          <div className="footer-title">Quick Links</div>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/orders">Orders</Link></li>
          </ul>
        </div>
        <div>
          <div className="footer-title">Categories</div>
          <ul className="footer-links">
            {['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports', 'Beauty'].map((c) => (
              <li key={c}><Link to={`/products?category=${c}`}>{c}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="footer-title">Contact</div>
          <ul className="footer-links">
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}><FiMail /> support@shopzone.com</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}><FiPhone /> +91 98765 43210</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}><FiMapPin /> Bangalore, India</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 ShopZone. All rights reserved. | MCA Final Year Project | Built with React & Node.js</p>
      </div>
    </footer>
  );
}
