import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Shirt, Home, Sparkles, Dumbbell, BookOpen, ArrowUpRight } from 'lucide-react';

const CATEGORY_META = {
  electronics: {
    icon: Smartphone,
    color: 'from-blue-600 to-indigo-700',
    count: '120+ Products',
  },
  fashion: {
    icon: Shirt,
    color: 'from-rose-600 to-pink-700',
    count: '240+ Products',
  },
  'home-kitchen': {
    icon: Home,
    color: 'from-emerald-600 to-teal-700',
    count: '95+ Products',
  },
  beauty: {
    icon: Sparkles,
    color: 'from-purple-600 to-violet-700',
    count: '60+ Products',
  },
  'sports-outdoors': {
    icon: Dumbbell,
    color: 'from-amber-500 to-orange-600',
    count: '80+ Products',
  },
  books: {
    icon: BookOpen,
    color: 'from-cyan-600 to-blue-700',
    count: '150+ Products',
  },
};

export const CategorySection = ({ categories = [] }) => {
  return (
    <section className="my-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Shop by Category
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Browse our top rated departments & essentials
          </p>
        </div>
        <Link
          to="/shop"
          className="text-xs sm:text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
        >
          View All
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((cat) => {
          const meta = CATEGORY_META[cat.slug] || {
            icon: Smartphone,
            color: 'from-brand-600 to-indigo-700',
            count: 'Browse',
          };
          const Icon = meta.icon;

          return (
            <Link
              key={cat._id || cat.slug}
              to={`/shop?category=${cat.slug || cat._id}`}
              className="group relative bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-brand-300 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center overflow-hidden"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${meta.color} flex items-center justify-center text-white mb-3 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-sm text-slate-800 group-hover:text-brand-600 transition">
                {cat.name}
              </h3>
              <span className="text-[11px] text-slate-400 mt-1">
                {meta.count}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
