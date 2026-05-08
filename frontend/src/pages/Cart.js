import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cart, cartTotal, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const shipping = cartTotal > 499 ? 0 : 49;
  const tax = Math.round(cartTotal * 0.18);
  const total = cartTotal + shipping + tax;

  if (!cart.items?.length) {
    return (
      <div className="page" style={{ textAlign: 'center', padding: '5rem 1.5rem' }} data-cy="empty-cart">
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
        <h2 style={{ marginBottom: '0.5rem' }}>Your cart is empty</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Add some products to get started</p>
        <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="page" data-cy="cart-page">
      <h1 className="page-title">Shopping Cart ({cart.items.length} items)</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
        {/* Items */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {cart.items.map((item) => (
            <div key={item.product?._id} className="cart-item" data-cy="cart-item">
              <img src={item.product?.images?.[0] || 'https://via.placeholder.com/80'} alt={item.product?.name} className="cart-item-img" />
              <div className="cart-item-info">
                <div className="cart-item-name" data-cy="cart-item-name">{item.product?.name}</div>
                <div className="cart-item-price" data-cy="cart-item-price">₹{item.price?.toLocaleString()}</div>
              </div>
              <div className="qty-control">
                <button className="qty-btn" onClick={() => updateQuantity(item.product?._id, item.quantity - 1)} data-cy="decrease-qty">−</button>
                <span className="qty-value" data-cy="item-quantity">{item.quantity}</span>
                <button className="qty-btn" onClick={() => updateQuantity(item.product?._id, item.quantity + 1)} data-cy="increase-qty">+</button>
              </div>
              <div style={{ fontWeight: 700, minWidth: 80, textAlign: 'right' }} data-cy="item-total">
                ₹{(item.price * item.quantity)?.toLocaleString()}
              </div>
              <button onClick={() => removeFromCart(item.product?._id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.5rem' }} data-cy="remove-item">
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1.2rem' }}>Order Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <span>Subtotal</span><span data-cy="subtotal">₹{cartTotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <span>Shipping</span><span style={{ color: shipping === 0 ? 'var(--success)' : 'inherit' }}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <span>Tax (18%)</span><span>₹{tax.toLocaleString()}</span>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}>
                <span>Total</span><span data-cy="cart-total">₹{total.toLocaleString()}</span>
              </div>
            </div>
            {shipping > 0 && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Add ₹{499 - cartTotal} more for free shipping</p>}
            <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => user ? navigate('/checkout') : navigate('/login')} data-cy="checkout-btn">
              Proceed to Checkout <FiArrowRight />
            </button>
            <Link to="/products" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: '0.8rem' }}>
              <FiShoppingBag /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
