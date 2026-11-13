import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Heart,
  ShoppingCart,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  Package,
  LogOut,
  Sparkles,
} from 'lucide-react';

export const Navbar = ({
  cartCount = 0,
  wishlistCount = 0,
  user = null,
  onLogout,
  categories = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set('keyword', searchQuery.trim());
      if (selectedCategory) {
        params.set('category', selectedCategory);
      }
      navigate(`/shop?${params.toString()}`);
    } else if (selectedCategory) {
      navigate(`/shop?category=${selectedCategory}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
      {/* Top micro banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-medium text-amber-400">
              <Sparkles className="w-3.5 h-3.5" /> Free Express Shipping
            </span>
            <span className="hidden sm:inline text-slate-400">on all orders over $50</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <Link to="/orders" className="hover:text-white transition">Track Order</Link>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300 font-medium">24/7 Support: 1-800-SPHERE</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4 lg:gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform duration-200">
              <ShoppingBag className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-slate-950 via-slate-800 to-brand-700 bg-clip-text text-transparent">
                ShopSphere
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-400 -mt-1">
                Premium Store
              </span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-2xl items-center relative"
          >
            <div className="w-full flex items-center rounded-xl border-2 border-slate-200 hover:border-brand-400 focus-within:border-brand-600 focus-within:ring-4 focus-within:ring-brand-500/10 transition bg-slate-50/50">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent border-r border-slate-200 text-xs font-semibold text-slate-600 px-3 py-2.5 rounded-l-xl focus:outline-none cursor-pointer hover:bg-slate-100/70"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id || cat.slug} value={cat.slug || cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Search products, brands, electronics, fashion..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
              >
              </input>

              <button
                type="submit"
                className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-r-[10px] font-medium transition flex items-center justify-center flex-shrink-0"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Action Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2.5 rounded-xl text-slate-600 hover:text-brand-600 hover:bg-brand-50/60 transition group"
              title="Wishlist"
            >
              <Heart className="w-6 h-6 stroke-[1.8] group-hover:scale-110 transition-transform" />
              {wishlistCount > 0 && (
                <span className="absolute 1 top-1.5 right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center ring-2 ring-white">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl text-slate-600 hover:text-brand-600 hover:bg-brand-50/60 transition group"
              title="Cart"
            >
              <ShoppingCart className="w-6 h-6 stroke-[1.8] group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute 1 top-1.5 right-1.5 w-5 h-5 rounded-full bg-brand-600 text-white text-[11px] font-bold flex items-center justify-center ring-2 ring-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* User Account / Dropdown */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-slate-50 transition"
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                      {user.name ? user.name[0] : 'U'}
                    </div>
                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-xs font-semibold text-slate-900 leading-tight">
                        {user.name.split(' ')[0]}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium capitalize">
                        {user.role}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-brand-600 font-medium hover:bg-brand-50 transition"
                        >
                          <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" /> My Profile
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                      >
                        <Package className="w-4 h-4 text-slate-400" /> My Orders
                      </Link>

                      <Link
                        to="/wishlist"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                      >
                        <Heart className="w-4 h-4 text-slate-400" /> My Wishlist
                      </Link>

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            if (onLogout) onLogout();
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition font-medium"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-brand-600 rounded-xl hover:bg-slate-100 transition"
                  >
                    <UserIcon className="w-4 h-4" /> Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition shadow-xs"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </form>
        </div>
      </div>

      {/* Category Sub-navigation */}
      <nav className="bg-slate-50 border-t border-slate-200/60 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs font-semibold text-slate-600 overflow-x-auto py-2.5">
          <div className="flex items-center gap-6">
            <Link to="/shop" className="hover:text-brand-600 flex items-center gap-1 text-brand-600 font-bold">
              All Products
            </Link>
            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat._id || cat.slug}
                to={`/shop?category=${cat.slug || cat._id}`}
                className="hover:text-brand-600 transition whitespace-nowrap"
              >
                {cat.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-5 text-slate-500 font-medium">
            <Link to="/shop?isFeatured=true" className="hover:text-brand-600 transition">
              Featured
            </Link>
            <Link to="/shop?isTrending=true" className="hover:text-brand-600 transition">
              Trending
            </Link>
            <Link to="/shop?isBestSeller=true" className="hover:text-brand-600 transition">
              Best Sellers
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          <div className="font-semibold text-xs text-slate-400 uppercase tracking-wider">
            Categories
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-slate-50 text-slate-700 hover:text-brand-600 font-medium"
            >
              All Products
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat._id || cat.slug}
                to={`/shop?category=${cat.slug || cat._id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg bg-slate-50 text-slate-700 hover:text-brand-600 font-medium"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2 text-sm font-medium">
            <Link
              to="/shop?isFeatured=true"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-600 hover:text-brand-600"
            >
              Featured Deals
            </Link>
            <Link
              to="/shop?isTrending=true"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-600 hover:text-brand-600"
            >
              Trending Now
            </Link>
            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-600 hover:text-brand-600"
            >
              Track Orders
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
