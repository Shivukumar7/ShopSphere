import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Mail, Phone, MapPin, ShieldCheck, Truck, RefreshCw, Headphones, ArrowRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      {/* Feature highlights bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-slate-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Free Express Shipping</h4>
              <p className="text-xs text-slate-400">On all orders over $50</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">100% Secure Checkout</h4>
              <p className="text-xs text-slate-400">Razorpay & COD verified</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">30-Day Easy Returns</h4>
              <p className="text-xs text-slate-400">Hassle-free guarantee</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">24/7 Expert Support</h4>
              <p className="text-xs text-slate-400">Dedicated assistance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
                <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                ShopSphere
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              ShopSphere is your premier modern shopping destination offering curated electronics, fashion, lifestyle goods, and home appliances with fast delivery and guaranteed authentic products.
            </p>
            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0" />
                124 Silicon Avenue, Tech City, CA 94016
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400 flex-shrink-0" />
                +1 (800) 555-SPHERE (7743)
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400 flex-shrink-0" />
                support@shopsphere.store
              </p>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Top Categories</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/shop?category=electronics" className="hover:text-white transition">Electronics & Gadgets</Link></li>
              <li><Link to="/shop?category=fashion" className="hover:text-white transition">Fashion & Apparel</Link></li>
              <li><Link to="/shop?category=home-kitchen" className="hover:text-white transition">Home & Kitchen</Link></li>
              <li><Link to="/shop?category=beauty" className="hover:text-white transition">Beauty & Personal Care</Link></li>
              <li><Link to="/shop?category=sports-outdoors" className="hover:text-white transition">Sports & Fitness</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Customer Care</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/orders" className="hover:text-white transition">Order Tracking</Link></li>
              <li><Link to="/profile" className="hover:text-white transition">My Account</Link></li>
              <li><Link to="/cart" className="hover:text-white transition">Shopping Cart</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition">Wishlist</Link></li>
              <li><span className="hover:text-white transition cursor-pointer">Shipping & Returns</span></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Stay Connected</h4>
            <p className="text-xs text-slate-400 mb-4">
              Subscribe for exclusive member discounts, flash sales, and new arrivals.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing to ShopSphere updates!'); }} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 p-1.5 bg-brand-600 hover:bg-brand-500 rounded-lg text-white transition"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[11px] text-slate-500 block">We respect your privacy. No spam ever.</span>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© {new Date().getFullYear()} ShopSphere Inc. All rights reserved. Built with MERN Stack.</p>
        <div className="flex items-center gap-4">
          <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-medium text-[11px]">Razorpay Test</span>
          <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-medium text-[11px]">COD Supported</span>
          <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-medium text-[11px]">JWT 256-bit</span>
        </div>
      </div>
    </footer>
  );
};
