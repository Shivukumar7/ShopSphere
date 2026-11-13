import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { ProductCard } from '../components/product/ProductCard';
import { ProductCardSkeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import {
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  RotateCcw,
  Check,
} from 'lucide-react';

export const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter state
  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const rating = searchParams.get('rating') || '';
  const inStock = searchParams.get('inStock') === 'true';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const { addToCart } = useCart();
  const { wishlistIds, toggleWishlist } = useWishlist();

  // Load categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCats();
  }, []);

  // Fetch products whenever search params change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products?${searchParams.toString()}`);
        if (res.data.success) {
          setProducts(res.data.products);
          setTotalPages(res.data.pages);
          setTotalCount(res.data.total);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value !== null && value !== '' && value !== false) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set('page', '1'); // Reset to page 1 on filter change
    setSearchParams(next);
  };

  const handlePageChange = (newPage) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', newPage.toString());
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/80 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {keyword ? `Search results for "${keyword}"` : category ? `Category: ${category}` : 'Explore All Products'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Showing {products.length} of {totalCount} total products
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Trigger */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-2xs"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400 hidden sm:inline">Sort:</span>
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-brand-600 shadow-2xs cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">Filters</h3>
            <button
              onClick={resetFilters}
              className="text-xs text-brand-600 hover:text-brand-800 flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Categories */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Category</h4>
            <div className="space-y-1">
              <button
                onClick={() => updateParam('category', '')}
                className={`w-full text-left text-xs py-1.5 px-2.5 rounded-lg transition ${
                  !category ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id || cat.slug}
                  onClick={() => updateParam('category', cat.slug)}
                  className={`w-full text-left text-xs py-1.5 px-2.5 rounded-lg transition flex items-center justify-between ${
                    category === cat.slug ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Price Range ($)</h4>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => updateParam('minPrice', e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-brand-500"
              />
              <span className="text-slate-400 text-xs">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => updateParam('maxPrice', e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Customer Rating</h4>
            <div className="space-y-1.5">
              {[4, 3, 2].map((stars) => (
                <button
                  key={stars}
                  onClick={() => updateParam('rating', rating === stars.toString() ? '' : stars.toString())}
                  className={`w-full flex items-center gap-2 text-xs py-1.5 px-2 rounded-lg transition ${
                    rating === stars.toString() ? 'bg-amber-50 text-amber-900 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < stars ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>
                  <span>& Up</span>
                </button>
              ))}
            </div>
          </div>

          {/* In Stock Toggle */}
          <div className="border-t border-slate-100 pt-4">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : '')}
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              In Stock Only
            </label>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <ProductCardSkeleton key={idx} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={addToCart}
                    onToggleWishlist={toggleWishlist}
                    isWishlisted={wishlistIds.includes(product._id)}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    disabled={page <= 1}
                    onClick={() => handlePageChange(page - 1)}
                    className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const p = i + 1;
                    return (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        className={`w-9 h-9 rounded-xl text-xs font-semibold transition ${
                          page === p
                            ? 'bg-brand-600 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}

                  <button
                    disabled={page >= totalPages}
                    onClick={() => handlePageChange(page + 1)}
                    className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              title="No products match your criteria"
              description="Try adjusting your keywords, price filters, or category selections."
              actionText="Clear All Filters"
              onAction={resetFilters}
            />
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6 z-10">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 uppercase">Filters</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase">Category</h4>
              <div className="space-y-1">
                <button
                  onClick={() => { updateParam('category', ''); setMobileFilterOpen(false); }}
                  className={`w-full text-left text-xs py-2 px-3 rounded-lg ${!category ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-600'}`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id || cat.slug}
                    onClick={() => { updateParam('category', cat.slug); setMobileFilterOpen(false); }}
                    className={`w-full text-left text-xs py-2 px-3 rounded-lg ${category === cat.slug ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-600'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => { resetFilters(); setMobileFilterOpen(false); }}
              className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
