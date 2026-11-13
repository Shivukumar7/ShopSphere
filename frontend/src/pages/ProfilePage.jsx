import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, Phone, MapPin, Plus, Lock, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Address modal state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPostalCode, setNewPostalCode] = useState('');
  const [newCountry, setNewCountry] = useState('United States');

  // Password update
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile({ name, phone });
    } catch (err) {
      // toast shown in context
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const updatedAddresses = [
      ...(user.addresses || []),
      {
        street: newStreet,
        city: newCity,
        state: newState,
        postalCode: newPostalCode,
        country: newCountry,
        isDefault: (user.addresses || []).length === 0,
      },
    ];

    try {
      await updateProfile({ addresses: updatedAddresses });
      setShowAddressModal(false);
      setNewStreet('');
      setNewCity('');
      setNewState('');
      setNewPostalCode('');
    } catch (err) {
      // toast shown in context
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      return showToast('New passwords do not match', 'error');
    }
    if (newPassword.length < 6) {
      return showToast('Password must be at least 6 characters', 'error');
    }

    setUpdatingPassword(true);
    try {
      const res = await api.put('/auth/update-password', {
        currentPassword,
        newPassword,
      });
      if (res.data.success) {
        showToast('Password updated successfully', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white font-bold text-2xl flex items-center justify-center shadow-md uppercase">
            {user?.name?.[0] || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{user?.name}</h1>
            <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5" /> {user?.email}
            </p>
          </div>
        </div>
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 capitalize border border-brand-200">
          Role: {user?.role || 'Customer'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Details Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-brand-600" /> Personal Information
          </h2>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-600 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition"
            >
              {savingProfile ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-brand-600" /> Security & Password
          </h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-600 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={updatingPassword}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition"
            >
              {updatingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>

      {/* Address Management */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-600" /> Saved Shipping Addresses
          </h2>
          <button
            onClick={() => setShowAddressModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold text-xs transition"
          >
            <Plus className="w-4 h-4" /> Add Address
          </button>
        </div>

        {user?.addresses && user.addresses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {user.addresses.map((addr, index) => (
              <div
                key={addr._id || index}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1 text-xs text-slate-600 relative"
              >
                {addr.isDefault && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mb-2">
                    <CheckCircle2 className="w-3 h-3" /> Default Address
                  </span>
                )}
                <p className="font-semibold text-slate-900 text-sm">{addr.street}</p>
                <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                <p>{addr.country}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-4">No shipping addresses saved yet.</p>
        )}
      </div>

      {/* Modal to add new address */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-fade-in">
            <h3 className="text-lg font-bold text-slate-900">Add New Shipping Address</h3>
            <form onSubmit={handleAddAddress} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  placeholder="123 Main Street, Apt 4B"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:border-brand-600 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="San Francisco"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:border-brand-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">State / Province</label>
                  <input
                    type="text"
                    required
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    placeholder="CA"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:border-brand-600 outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={newPostalCode}
                    onChange={(e) => setNewPostalCode(e.target.value)}
                    placeholder="94105"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:border-brand-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:border-brand-600 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold transition"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
