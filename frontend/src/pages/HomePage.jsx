import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HeroBanner } from '../components/home/HeroBanner';
import { CategorySection } from '../components/home/CategorySection';
import { PromoBanner } from '../components/home/PromoBanner';
import { ProductCard } from '../components/product/ProductCard';
import { ProductCardSkeleton } from '../components/common/Skeleton';
import { ArrowRight, Flame, Sparkles, Trophy } from 'lucide-react';
import api from '../services/api';

export const HomePage = ({ onAddToCart, onToggleWishlist, wishlistIds = [] }) => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        const [catRes, featRes, trendRes, bestRes] = await Promise.allSettled([
          api.get('/categories'),
          api.get('/products?isFeatured=true&limit=4'),
          api.get('/products?isTrending=true&limit=4'),
          api.get('/products?isBestSeller=true&limit=4'),
        ]);

        if (catRes.status === 'fulfilled') setCategories(catRes.value.data.categories || []);
        if (featRes.status === 'fulfilled') setFeaturedProducts(featRes.value.data.products || []);
        if (trendRes.status === 'fulfilled') setTrendingProducts(trendRes.value.data.products || []);
        if (bestRes.status === 'fulfilled') setBestSellers(bestRes.value.data.products || []);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      {/* Hero Banner Slider */}
      <HeroBanner />

      {/* Category Section */}
      <CategorySection categories={categories} />

      {/* Featured Products Showcase */}
      <section className="my-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-500">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Featured Highlights
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Top rated innovations hand-picked for quality
              </p>
            </div>
          </div>
          <Link
            to="/shop?isFeatured=true"
            className="text-xs sm:text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            Explore All <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => <ProductCardSkeleton key={idx} />)
          ) : featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlistIds.includes(product._id)}
              />
            ))
          ) : (
            <div className="col-span-full py-8 text-center text-sm text-slate-400">
              Featured products will appear here once seeded in the database.
            </div>
          )}
        </div>
      </section>

      {/* Promotional Double Banner */}
      <PromoBanner />

      {/* Trending Products */}
      <section className="my-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-500">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Trending Right Now
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                What everyone is shopping this week
              </p>
            </div>
          </div>
          <Link
            to="/shop?isTrending=true"
            className="text-xs sm:text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            View More <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => <ProductCardSkeleton key={idx} />)
          ) : trendingProducts.length > 0 ? (
            trendingProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlistIds.includes(product._id)}
              />
            ))
          ) : (
            <div className="col-span-full py-8 text-center text-sm text-slate-400">
              Trending products loading or awaiting database seed.
            </div>
          )}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="my-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-500">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                All-Time Best Sellers
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Customer favorites backed by 5-star verified reviews
              </p>
            </div>
          </div>
          <Link
            to="/shop?isBestSeller=true"
            className="text-xs sm:text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            See Top 100 <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => <ProductCardSkeleton key={idx} />)
          ) : bestSellers.length > 0 ? (
            bestSellers.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlistIds.includes(product._id)}
              />
            ))
          ) : (
            <div className="col-span-full py-8 text-center text-sm text-slate-400">
              Best seller catalog ready to populate.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
