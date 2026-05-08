import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../utils/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [cartLoading, setCartLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) fetchCart();
    else setCart({ items: [] });
  }, [user]);

  const fetchCart = async () => {
    try {
      const { data } = await cartAPI.get();
      setCart(data.cart);
    } catch {}
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user) { toast.error('Please login to add items to cart'); return; }
    setCartLoading(true);
    try {
      const { data } = await cartAPI.add(productId, quantity);
      setCart(data.cart);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setCartLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const { data } = await cartAPI.update(productId, quantity);
      setCart(data.cart);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const { data } = await cartAPI.remove(productId);
      setCart(data.cart);
      toast.success('Item removed');
    } catch (err) {
      toast.error('Remove failed');
    }
  };

  const clearCart = () => setCart({ items: [] });

  const cartCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  const cartTotal = cart.items?.reduce((sum, i) => sum + i.price * i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, cartCount, cartTotal, cartLoading, addToCart, updateQuantity, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
