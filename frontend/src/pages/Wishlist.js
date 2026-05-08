import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { wishlistAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    wishlistAPI.get()
      .then(({ data }) => setWishlist(data.wishlist?.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (productId) => {
    try {
      await wishlistAPI.toggle(productId);
      setWishlist((prev) => prev.filter((p) => p._id !== productId));
      toast.success('Removed from wishlist');
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="page" data-cy="wishlist-page">
      <h1 className="page-title">My Wishlist ({wishlist.length})</h1>
      {wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <FiHeart style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3>Your wishlist is empty</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Save items you love</p>
          <Link to="/products" className="btn btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="products-grid">
          {wishlist.map((product) => (
            <div key={product._id} className="product-card" data-cy="wishlist-item">
              <div className="product-card-img-wrap">
                <img src={product.images?.[0] || 'https://via.placeholder.com/300'} alt={product.name} className="product-card-img" />
              </div>
              <div className="product-card-body">
                <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
                  <div className="product-card-title">{product.name}</div>
                </Link>
                <div className="product-card-price">
                  <span className="price-current">₹{product.price?.toLocaleString()}</span>
                </div>
                <div className="product-card-actions">
                  <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => addToCart(product._id)} data-cy="add-to-cart-from-wishlist">
                    <FiShoppingCart /> Add to Cart
                  </button>
                  <button className="wishlist-btn active" onClick={() => handleRemove(product._id)} data-cy="remove-from-wishlist">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
