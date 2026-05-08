import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiStar, FiArrowLeft, FiTruck, FiShield } from 'react-icons/fi';
import { productAPI, wishlistAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/product/ProductCard';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([productAPI.getOne(id), productAPI.getRecommendations(id)])
      .then(([{ data: pd }, { data: rd }]) => {
        setProduct(pd.product);
        setRecommendations(rd.products);
      })
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleWishlist = async () => {
    if (!user) { toast.error('Please login'); return; }
    try {
      await wishlistAPI.toggle(id);
      setIsWishlisted((w) => !w);
      toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    } catch { toast.error('Failed'); }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to review'); return; }
    setSubmittingReview(true);
    try {
      await productAPI.addReview(id, review);
      toast.success('Review submitted!');
      const { data } = await productAPI.getOne(id);
      setProduct(data.product);
      setReview({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally { setSubmittingReview(false); }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /><p className="loading-text">Loading product...</p></div>;
  if (!product) return null;

  const discount = product.discount || (product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0);

  return (
    <div className="page" data-cy="product-detail-page">
      <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm" style={{ marginBottom: '1.5rem' }}>
        <FiArrowLeft /> Back
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
        {/* Images */}
        <div>
          <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: '1rem', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <img src={product.images?.[activeImg] || 'https://via.placeholder.com/500'} alt={product.name}
              style={{ width: '100%', height: 400, objectFit: 'cover' }} data-cy="product-image" />
          </div>
          {product.images?.length > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {product.images.map((img, i) => (
                <img key={i} src={img} alt="" onClick={() => setActiveImg(i)}
                  style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 8, cursor: 'pointer', border: `2px solid ${activeImg === i ? 'var(--primary)' : 'var(--border)'}` }} />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '0.8rem' }}>{product.category}</span>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.5rem' }} data-cy="product-title">{product.name}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.8rem' }}>by {product.brand}</p>

          <div className="stars" style={{ marginBottom: '1rem' }}>
            {[1,2,3,4,5].map((s) => (
              <FiStar key={s} style={{ color: s <= Math.round(product.ratings) ? '#fbbf24' : 'var(--border)', fill: s <= Math.round(product.ratings) ? '#fbbf24' : 'none', fontSize: '1.1rem' }} />
            ))}
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{product.ratings?.toFixed(1)} ({product.numReviews} reviews)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }} data-cy="product-price">₹{product.price?.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <>
                <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{product.originalPrice?.toLocaleString()}</span>
                <span className="badge badge-success">{discount}% OFF</span>
              </>
            )}
          </div>

          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>{product.description}</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <span style={{ fontWeight: 600 }}>Quantity:</span>
            <div className="qty-control">
              <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span className="qty-value" data-cy="quantity">{qty}</span>
              <button className="qty-btn" onClick={() => setQty(Math.min(product.stock, qty + 1))}>+</button>
            </div>
            <span style={{ color: product.stock > 0 ? 'var(--success)' : 'var(--danger)', fontSize: '0.85rem', fontWeight: 600 }}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={() => addToCart(product._id, qty)}
              disabled={product.stock === 0} data-cy="add-to-cart-btn">
              <FiShoppingCart /> Add to Cart
            </button>
            <button className={`wishlist-btn ${isWishlisted ? 'active' : ''}`} style={{ padding: '0.85rem 1.2rem', fontSize: '1.2rem' }}
              onClick={handleWishlist} data-cy="wishlist-btn">
              <FiHeart style={{ fill: isWishlisted ? 'currentColor' : 'none' }} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', padding: '1rem', background: 'var(--bg)', borderRadius: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <FiTruck style={{ color: 'var(--primary)' }} /> Free delivery above ₹499
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <FiShield style={{ color: 'var(--success)' }} /> Secure payment
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Customer Reviews</h3>
        {product.reviews?.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first to review!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {product.reviews?.map((r, i) => (
              <div key={i} style={{ padding: '1rem', background: 'var(--bg)', borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600 }}>{r.name}</span>
                  <div className="stars">
                    {[1,2,3,4,5].map((s) => <FiStar key={s} style={{ color: s <= r.rating ? '#fbbf24' : 'var(--border)', fill: s <= r.rating ? '#fbbf24' : 'none' }} />)}
                  </div>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{r.comment}</p>
              </div>
            ))}
          </div>
        )}
        {user && (
          <form onSubmit={handleReview} data-cy="review-form">
            <h4 style={{ fontWeight: 600, marginBottom: '1rem' }}>Write a Review</h4>
            <div className="form-group">
              <label className="form-label">Rating</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[1,2,3,4,5].map((s) => (
                  <FiStar key={s} onClick={() => setReview({ ...review, rating: s })} style={{ cursor: 'pointer', fontSize: '1.5rem', color: s <= review.rating ? '#fbbf24' : 'var(--border)', fill: s <= review.rating ? '#fbbf24' : 'none' }} />
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Comment</label>
              <textarea className="form-input" rows={3} placeholder="Share your experience..." value={review.comment}
                onChange={(e) => setReview({ ...review, comment: e.target.value })} data-cy="review-comment" />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submittingReview} data-cy="submit-review">
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <h3 className="section-title">You May Also Like</h3>
          <div className="products-grid">
            {recommendations.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
