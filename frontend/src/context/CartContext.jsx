import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [cart, setCart] = useState({
    items: [],
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
    totalItems: 0,
  });
  const [loading, setLoading] = useState(false);

  // Recalculate local totals
  const computeTotals = (items) => {
    const itemsPrice = items.reduce((acc, item) => {
      const p = item.product?.price || item.price || 0;
      return acc + p * item.quantity;
    }, 0);
    const shippingPrice = itemsPrice > 50 || itemsPrice === 0 ? 0 : 9.99;
    const taxPrice = Number((itemsPrice * 0.08).toFixed(2));
    const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

    return {
      items,
      itemsPrice: Number(itemsPrice.toFixed(2)),
      shippingPrice,
      taxPrice,
      totalPrice,
      totalItems,
    };
  };

  const fetchCart = useCallback(async () => {
    if (user) {
      try {
        setLoading(true);
        const res = await api.get('/cart');
        if (res.data.success) {
          setCart(res.data.cart);
        }
      } catch (error) {
        console.error('Failed to fetch user cart:', error.message);
      } finally {
        setLoading(false);
      }
    } else {
      // Guest cart from localStorage
      const guestItems = JSON.parse(localStorage.getItem('shopsphere_guest_cart') || '[]');
      setCart(computeTotals(guestItems));
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product, quantity = 1) => {
    if (user) {
      try {
        const res = await api.post('/cart', {
          productId: product._id,
          quantity,
        });
        if (res.data.success) {
          setCart(res.data.cart);
          showToast(`Added "${product.name}" to cart`, 'success');
        }
      } catch (error) {
        showToast(error.message, 'error');
      }
    } else {
      // Guest cart fallback
      let guestItems = JSON.parse(localStorage.getItem('shopsphere_guest_cart') || '[]');
      const existing = guestItems.find((item) => (item.product?._id || item.product) === product._id);

      if (existing) {
        existing.quantity += quantity;
      } else {
        guestItems.push({
          product,
          quantity,
          price: product.price,
        });
      }

      localStorage.setItem('shopsphere_guest_cart', JSON.stringify(guestItems));
      setCart(computeTotals(guestItems));
      showToast(`Added "${product.name}" to cart`, 'success');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }

    if (user) {
      try {
        const res = await api.put(`/cart/${productId}`, { quantity });
        if (res.data.success) {
          setCart(res.data.cart);
        }
      } catch (error) {
        showToast(error.message, 'error');
      }
    } else {
      let guestItems = JSON.parse(localStorage.getItem('shopsphere_guest_cart') || '[]');
      const item = guestItems.find((i) => (i.product?._id || i.product) === productId);
      if (item) {
        item.quantity = quantity;
        localStorage.setItem('shopsphere_guest_cart', JSON.stringify(guestItems));
        setCart(computeTotals(guestItems));
      }
    }
  };

  const removeFromCart = async (productId) => {
    if (user) {
      try {
        const res = await api.delete(`/cart/${productId}`);
        if (res.data.success) {
          setCart(res.data.cart);
          showToast('Item removed from cart', 'info');
        }
      } catch (error) {
        showToast(error.message, 'error');
      }
    } else {
      let guestItems = JSON.parse(localStorage.getItem('shopsphere_guest_cart') || '[]');
      guestItems = guestItems.filter((i) => (i.product?._id || i.product) !== productId);
      localStorage.setItem('shopsphere_guest_cart', JSON.stringify(guestItems));
      setCart(computeTotals(guestItems));
      showToast('Item removed from cart', 'info');
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await api.delete('/cart');
      } catch (error) {
        console.error(error);
      }
    } else {
      localStorage.removeItem('shopsphere_guest_cart');
    }
    setCart({
      items: [],
      itemsPrice: 0,
      shippingPrice: 0,
      taxPrice: 0,
      totalPrice: 0,
      totalItems: 0,
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
