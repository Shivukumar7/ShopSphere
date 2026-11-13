import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('shopsphere_token') || null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('shopsphere_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
          }
        } catch (error) {
          console.error('[Auth] Failed to load session:', error.message);
          localStorage.removeItem('shopsphere_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('shopsphere_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        showToast(`Welcome back, ${res.data.user.name}!`, 'success');
        return res.data.user;
      }
    } catch (error) {
      showToast(error.message, 'error');
      throw error;
    }
  };

  const register = async (name, email, password, phone, role) => {
    try {
      const res = await api.post('/auth/register', { name, email, password, phone, role });
      if (res.data.success) {
        localStorage.setItem('shopsphere_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        showToast('Registration successful! Welcome to ShopSphere.', 'success');
        return res.data.user;
      }
    } catch (error) {
      showToast(error.message, 'error');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('shopsphere_token');
    setToken(null);
    setUser(null);
    showToast('Signed out successfully.', 'info');
  };

  const updateProfile = async (data) => {
    try {
      const res = await api.put('/auth/profile', data);
      if (res.data.success) {
        setUser(res.data.user);
        showToast('Profile updated successfully', 'success');
        return res.data.user;
      }
    } catch (error) {
      showToast(error.message, 'error');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
