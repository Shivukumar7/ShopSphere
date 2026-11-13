import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Gift } from 'lucide-react';

export const PromoBanner = () => {
  return (
    <section className="my-12 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Banner 1 */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-violet-900 to-indigo-800 p-8 sm:p-10 text-white flex flex-col justify-between shadow-xl">
        <div className="relative z-10 max-w-sm space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" /> Weekend Super Deal
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            Level Up Your Workspace Setup
          </h3>
          <p className="text-violet-200 text-xs sm:text-sm">
            Save up to 40% on mechanical keyboards, 4K monitors, and ergonomic accessories.
          </p>
          <div className="pt-2">
            <Link
              to="/shop?category=electronics"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-violet-900 hover:bg-violet-50 font-bold text-xs uppercase tracking-wider transition shadow-sm"
            >
              Explore Deals <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-25 md:opacity-40 pointer-events-none flex items-center justify-end pr-4">
          <img
            src="https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80"
            alt="Workspace"
            className="h-full object-cover rounded-l-3xl"
          />
        </div>
      </div>

      {/* Banner 2 */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-900 to-teal-800 p-8 sm:p-10 text-white flex flex-col justify-between shadow-xl">
        <div className="relative z-10 max-w-sm space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Gift className="w-3.5 h-3.5" /> Curated Collection
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            Premium Home & Kitchen Luxe
          </h3>
          <p className="text-emerald-200 text-xs sm:text-sm">
            Modern artisan cookware, smart espresso makers, and Scandinavian decor pieces.
          </p>
          <div className="pt-2">
            <Link
              to="/shop?category=home-kitchen"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 font-bold text-xs uppercase tracking-wider transition shadow-sm"
            >
              Shop Kitchen <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-25 md:opacity-40 pointer-events-none flex items-center justify-end pr-4">
          <img
            src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80"
            alt="Kitchen"
            className="h-full object-cover rounded-l-3xl"
          />
        </div>
      </div>
    </section>
  );
};
