import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { wishlistAPI } from '../../utils/api';
import toast from 'react-hot-toast';

export default function ProductCard({ product, wishlistIds = [], onWishlistToggle }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isWishlisted = wishlistIds.includes(product._id);
  const discount = product.discount || (product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0);

  const handleWishlist = async (e) => {
    e.stopPropagation();
    if (!user) { toast.error('Please login'); return; }
    try {
      await wishlistAPI.toggle(product._id);
      onWishlistToggle && onWishlistToggle(product._id);
    } catch { toast.error('Failed'); }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product._id);
  };

  return (
    <div className="product-card fade-in" data-cy="product-card" onClick={() => navigate(`/products/${product._id}`)}>
      <div className="product-card-img-wrap">
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/300x220?text=No+Image'}
          alt={product.name}
          className="product-card-img"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x220?text=No+Image'; }}
        />
        {discount > 0 && <span className="product-badge">-{discount}%</span>}
      </div>
      <div className="product-card-body">
        <div className="product-card-brand">{product.brand}</div>
        <div className="product-card-title" data-cy="product-name">{product.name}</div>
        <div className="stars">
          {[1,2,3,4,5].map((s) => (
            <FiStar key={s} className={s <= Math.round(product.ratings) ? 'star' : 'star-empty'} style={{ fill: s <= Math.round(product.ratings) ? '#fbbf24' : 'none' }} />
          ))}
          <span className="rating-count">({product.numReviews})</span>
        </div>
        <div className="product-card-price">
          <span className="price-current" data-cy="product-price">₹{product.price?.toLocaleString()}</span>
          {product.originalPrice > product.price && (
            <span className="price-original">₹{product.originalPrice?.toLocaleString()}</span>
          )}
          {discount > 0 && <span className="price-discount">{discount}% off</span>}
        </div>
        <div className="product-card-actions">
          <button
            className="btn btn-primary btn-sm"
            style={{ flex: 1 }}
            onClick={handleAddToCart}
            data-cy="add-to-cart-btn"
            disabled={product.stock === 0}
          >
            <FiShoppingCart /> {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
          <button
            className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
            onClick={handleWishlist}
            data-cy="wishlist-btn"
          >
            <FiHeart style={{ fill: isWishlisted ? 'currentColor' : 'none' }} />
          </button>
        </div>
      </div>
    </div>
  );
}
