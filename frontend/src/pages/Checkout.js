import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../utils/api';
import toast from 'react-hot-toast';

const STEPS = ['Address', 'Payment', 'Review'];
const PAYMENT_METHODS = ['COD', 'Card', 'UPI', 'NetBanking'];

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({ fullName: '', phone: '', street: '', city: '', state: '', pincode: '', country: 'India' });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [errors, setErrors] = useState({});

  const shipping = cartTotal > 499 ? 0 : 49;
  const tax = Math.round(cartTotal * 0.18);
  const total = cartTotal + shipping + tax;

  const validateAddress = () => {
    const e = {};
    if (!address.fullName) e.fullName = 'Required';
    if (!address.phone || !/^\d{10}$/.test(address.phone)) e.phone = 'Valid 10-digit phone required';
    if (!address.street) e.street = 'Required';
    if (!address.city) e.city = 'Required';
    if (!address.state) e.state = 'Required';
    if (!address.pincode || !/^\d{6}$/.test(address.pincode)) e.pincode = 'Valid 6-digit pincode required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderItems = cart.items.map((i) => ({
        product: i.product._id,
        name: i.product.name,
        image: i.product.images?.[0],
        price: i.price,
        quantity: i.quantity,
      }));
      const { data } = await orderAPI.create({ orderItems, shippingAddress: address, paymentMethod, itemsPrice: cartTotal, shippingPrice: shipping, taxPrice: tax, totalPrice: total });
      if (paymentMethod !== 'COD') {
        await orderAPI.pay(data.order._id, { id: 'PAY_' + Date.now(), status: 'COMPLETED' });
      }
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-success/${data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally { setLoading(false); }
  };

  const inputField = (key, label, placeholder, type = 'text') => (
    <div className="form-group" key={key}>
      <label className="form-label">{label}</label>
      <input type={type} className="form-input" placeholder={placeholder} value={address[key]}
        onChange={(e) => setAddress({ ...address, [key]: e.target.value })} data-cy={`${key}-input`} />
      {errors[key] && <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.3rem' }}>{errors[key]}</p>}
    </div>
  );

  return (
    <div className="page" data-cy="checkout-page">
      <h1 className="page-title">Checkout</h1>

      {/* Steps */}
      <div className="checkout-steps">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className={`step ${i === step ? 'active' : i < step ? 'done' : ''}`}>
              <div className="step-num">{i < step ? <FiCheck /> : i + 1}</div>
              <span className="step-label">{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className="step-line" />}
          </React.Fragment>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
        <div>
          {/* Step 0: Address */}
          {step === 0 && (
            <div className="card" style={{ padding: '1.5rem' }} data-cy="address-form">
              <h3 style={{ fontWeight: 700, marginBottom: '1.2rem' }}>Shipping Address</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                {inputField('fullName', 'Full Name', 'John Doe')}
                {inputField('phone', 'Phone Number', '10-digit mobile number', 'tel')}
              </div>
              {inputField('street', 'Street Address', 'House no, Street, Area')}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                {inputField('city', 'City', 'City')}
                {inputField('state', 'State', 'State')}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                {inputField('pincode', 'Pincode', '6-digit pincode')}
                {inputField('country', 'Country', 'Country')}
              </div>
              <button className="btn btn-primary btn-lg" onClick={() => { if (validateAddress()) setStep(1); }} data-cy="continue-to-payment">
                Continue to Payment
              </button>
            </div>
          )}

          {/* Step 1: Payment */}
          {step === 1 && (
            <div className="card" style={{ padding: '1.5rem' }} data-cy="payment-form">
              <h3 style={{ fontWeight: 700, marginBottom: '1.2rem' }}>Payment Method</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
                {PAYMENT_METHODS.map((m) => (
                  <label key={m} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem', border: `2px solid ${paymentMethod === m ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s' }}>
                    <input type="radio" name="payment" value={m} checked={paymentMethod === m} onChange={() => setPaymentMethod(m)} data-cy={`payment-${m}`} />
                    <span style={{ fontWeight: 600 }}>{m === 'COD' ? '💵 Cash on Delivery' : m === 'Card' ? '💳 Credit/Debit Card' : m === 'UPI' ? '📱 UPI Payment' : '🏦 Net Banking'}</span>
                  </label>
                ))}
              </div>
              {paymentMethod === 'Card' && (
                <div style={{ padding: '1rem', background: 'var(--bg)', borderRadius: 10, marginBottom: '1rem' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.8rem' }}>Demo Card Details</p>
                  {['Card Number: 4111 1111 1111 1111', 'Expiry: 12/26', 'CVV: 123'].map((t) => (
                    <div key={t} className="form-group" style={{ marginBottom: '0.5rem' }}>
                      <input className="form-input" defaultValue={t.split(': ')[1]} readOnly style={{ fontSize: '0.85rem' }} />
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-outline" onClick={() => setStep(0)}>Back</button>
                <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={() => setStep(2)} data-cy="continue-to-review">Review Order</button>
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div className="card" style={{ padding: '1.5rem' }} data-cy="order-review">
              <h3 style={{ fontWeight: 700, marginBottom: '1.2rem' }}>Review Your Order</h3>
              {cart.items.map((item) => (
                <div key={item.product._id} style={{ display: 'flex', gap: '1rem', padding: '0.8rem 0', borderBottom: '1px solid var(--border)' }}>
                  <img src={item.product.images?.[0]} alt={item.product.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.product.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Qty: {item.quantity}</div>
                  </div>
                  <div style={{ fontWeight: 700 }}>₹{(item.price * item.quantity).toLocaleString()}</div>
                </div>
              ))}
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg)', borderRadius: 10, fontSize: '0.9rem' }}>
                <p><strong>Deliver to:</strong> {address.fullName}, {address.street}, {address.city} - {address.pincode}</p>
                <p><strong>Payment:</strong> {paymentMethod}</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
                <button className="btn btn-success btn-lg" style={{ flex: 1 }} onClick={handlePlaceOrder} disabled={loading} data-cy="place-order-btn">
                  {loading ? 'Placing Order...' : '🎉 Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="card" style={{ padding: '1.5rem', height: 'fit-content' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Order Summary</h3>
          {cart.items.map((item) => (
            <div key={item.product._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
              <span>{item.product.name} × {item.quantity}</span>
              <span>₹{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1rem 0' }} />
          {[['Subtotal', `₹${cartTotal.toLocaleString()}`], ['Shipping', shipping === 0 ? 'FREE' : `₹${shipping}`], ['Tax (18%)', `₹${tax.toLocaleString()}`]].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
              <span>{l}</span><span>{v}</span>
            </div>
          ))}
          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1rem 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}>
            <span>Total</span><span data-cy="order-total">₹{total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
