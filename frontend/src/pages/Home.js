import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiTruck, FiRefreshCw, FiHeadphones } from 'react-icons/fi';
import { productAPI } from '../utils/api';
import ProductCard from '../components/product/ProductCard';

const features = [
  { icon: FiTruck, title: 'Free Delivery', desc: 'On orders above ₹499' },
  { icon: FiShield, title: 'Secure Payment', desc: '100% secure transactions' },
  { icon: FiRefreshCw, title: 'Easy Returns', desc: '30-day return policy' },
  { icon: FiHeadphones, title: '24/7 Support', desc: 'Always here to help' },
];

const categories = [
  { name: 'Electronics', emoji: '📱', color: '#6366f1' },
  { name: 'Clothing', emoji: '👕', color: '#f59e0b' },
  { name: 'Books', emoji: '📚', color: '#10b981' },
  { name: 'Home & Kitchen', emoji: '🏠', color: '#ef4444' },
  { name: 'Sports', emoji: '⚽', color: '#3b82f6' },
  { name: 'Beauty', emoji: '💄', color: '#ec4899' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productAPI.getFeatured()
      .then(({ data }) => setFeatured(data.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div data-cy="home-page">
      {/* Hero */}
      <section className="hero">
        <h1>Shop Smarter,<br />Live Better 🛍️</h1>
        <p>Discover thousands of products at unbeatable prices</p>
        <div className="hero-actions">
          <Link to="/products" className="hero-btn hero-btn-primary" data-cy="shop-now-btn">
            Shop Now <FiArrowRight />
          </Link>
          <Link to="/products?category=Electronics" className="hero-btn hero-btn-outline">
            Explore Electronics
          </Link>
        </div>
      </section>

      {/* Features */}
      <section style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', padding: '2rem 1.5rem' }}>
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '1.3rem', flexShrink: 0 }}>
                <Icon />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{title}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="page">
        <h2 className="section-title">Shop by Category</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
          {categories.map(({ name, emoji, color }) => (
            <Link
              key={name}
              to={`/products?category=${name}`}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.5rem 1rem', textAlign: 'center', textDecoration: 'none', transition: 'all 0.3s', display: 'block' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
              data-cy="category-link"
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{emoji}</div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text)' }}>{name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="page" style={{ paddingTop: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Featured Products</h2>
          <Link to="/products" className="btn btn-outline btn-sm">View All <FiArrowRight /></Link>
        </div>
        {loading ? (
          <div className="products-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card" style={{ height: 340 }}>
                <div className="skeleton" style={{ height: 220 }} />
                <div style={{ padding: '1rem' }}>
                  <div className="skeleton" style={{ height: 16, marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 16, width: '60%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="products-grid">
            {featured.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      {/* Banner */}
      <section style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', margin: '0 1.5rem 2rem', borderRadius: 16, padding: '3rem 2rem', textAlign: 'center', color: 'white' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>🔥 Mega Sale — Up to 70% Off!</h2>
        <p style={{ opacity: 0.9, marginBottom: '1.5rem' }}>Limited time offer on top brands. Don't miss out!</p>
        <Link to="/products" className="hero-btn hero-btn-primary">Grab Deals Now</Link>
      </section>
    </div>
  );
}
