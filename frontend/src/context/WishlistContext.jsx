import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (user) {
      try {
        setLoading(true);
        const res = await api.get('/wishlist');
        if (res.data.success) {
          setWishlist(res.data.wishlist || []);
        }
      } catch (error) {
        console.error('Failed to fetch wishlist:', error.message);
      } finally {
        setLoading(false);
      }
    } else {
      const guestWishlist = JSON.parse(localStorage.getItem('shopsphere_guest_wishlist') || '[]');
      setWishlist(guestWishlist);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = async (product) => {
    if (user) {
      try {
        const res = await api.post('/wishlist/toggle', { productId: product._id });
        if (res.data.success) {
          if (res.data.isWishlisted) {
            setWishlist((prev) => [...prev, product]);
            showToast(`Added "${product.name}" to wishlist`, 'success');
          } else {
            setWishlist((prev) => prev.filter((item) => (item._id || item) !== product._id));
            showToast(`Removed "${product.name}" from wishlist`, 'info');
          }
        }
      } catch (error) {
        showToast(error.message, 'error');
      }
    } else {
      let guestWishlist = JSON.parse(localStorage.getItem('shopsphere_guest_wishlist') || '[]');
      const exists = guestWishlist.some((item) => (item._id || item) === product._id);

      if (exists) {
        guestWishlist = guestWishlist.filter((item) => (item._id || item) !== product._id);
        showToast(`Removed "${product.name}" from wishlist`, 'info');
      } else {
        guestWishlist.push(product);
        showToast(`Added "${product.name}" to wishlist`, 'success');
      }

      localStorage.setItem('shopsphere_guest_wishlist', JSON.stringify(guestWishlist));
      setWishlist(guestWishlist);
    }
  };

  const wishlistIds = wishlist.map((item) => item._id || item);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistIds,
        loading,
        toggleWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
