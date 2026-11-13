import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(redirect);
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (quickEmail, quickPass) => {
    setEmail(quickEmail);
    setPassword(quickPass);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition">
              <ShoppingBag className="w-6 h-6 stroke-[2.2]" />
            </div>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Sign In to ShopSphere
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Welcome back! Please enter your details to continue.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Demo Quick Logins */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
          <p className="font-semibold text-slate-700 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-brand-600" /> 1-Click Demo Accounts:
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('alex@example.com', 'password123')}
              className="flex-1 py-1.5 px-2.5 rounded-xl bg-white border border-slate-200 hover:border-brand-500 hover:text-brand-600 text-slate-700 font-medium transition text-center shadow-2xs"
            >
              Customer Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@shopsphere.com', 'adminpassword123')}
              className="flex-1 py-1.5 px-2.5 rounded-xl bg-indigo-50 border border-indigo-200 hover:border-indigo-500 hover:text-indigo-700 text-indigo-800 font-medium transition text-center shadow-2xs"
            >
              Admin Demo
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-600 focus:ring-4 focus:ring-brand-500/10 text-sm placeholder-slate-400 text-slate-900 transition outline-none"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-brand-600 focus:ring-4 focus:ring-brand-500/10 text-sm placeholder-slate-400 text-slate-900 transition outline-none"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition shadow-md shadow-brand-600/25 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link
            to={`/register?redirect=${encodeURIComponent(redirect)}`}
            className="font-semibold text-brand-600 hover:text-brand-700 underline"
          >
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};
