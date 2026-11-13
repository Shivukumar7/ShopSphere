import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { RatingStars } from './RatingStars';
import { formatCurrency, calculateDiscountPercentage } from '../../utils/formatters';

export const ProductCard = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
  isAddingToCart = false,
}) => {
  const discountPercent = calculateDiscountPercentage(product.discountPrice, product.price);
  const imageUrl = product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between">
      {/* Top Image Box */}
      <div className="relative aspect-square overflow-hidden bg-slate-50 flex items-center justify-center p-4">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500 text-white shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-xs uppercase tracking-wide">
              Best Seller
            </span>
          )}
          {product.isTrending && !product.isBestSeller && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-600 text-white shadow-xs uppercase tracking-wide">
              Trending
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onToggleWishlist) onToggleWishlist(product);
          }}
          className={`absolute top-3 right-3 z-10 p-2 rounded-xl backdrop-blur-md transition-all duration-200 ${
            isWishlisted
              ? 'bg-rose-50 text-rose-500 shadow-sm'
              : 'bg-white/80 text-slate-500 hover:text-rose-500 hover:bg-white shadow-xs'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Product Image */}
        <Link to={`/product/${product._id}`} className="w-full h-full flex items-center justify-center">
          <img
            src={imageUrl}
            alt={product.name}
            className="max-h-full max-w-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
            }}
          />
        </Link>
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-brand-600">
              {product.brand || (typeof product.category === 'object' ? product.category?.name : 'ShopSphere')}
            </span>
            <span className="text-[11px]">
              {product.countInStock > 0 ? (
                product.countInStock <= 5 ? (
                  <span className="text-amber-600 font-medium">Only {product.countInStock} left</span>
                ) : (
                  <span className="text-emerald-600 font-medium">In Stock</span>
                )
              ) : (
                <span className="text-rose-600 font-medium">Out of Stock</span>
              )}
            </span>
          </div>

          {/* Title */}
          <Link
            to={`/product/${product._id}`}
            className="block text-sm font-semibold text-slate-800 hover:text-brand-600 line-clamp-2 transition mb-2"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div className="mb-3">
            <RatingStars rating={product.rating || 0} numReviews={product.numReviews || 0} size="xs" />
          </div>
        </div>

        {/* Price & Add to Cart button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-slate-900">
                {formatCurrency(product.price)}
              </span>
              {product.discountPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  {formatCurrency(product.discountPrice)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => onAddToCart && onAddToCart(product)}
            disabled={product.countInStock === 0 || isAddingToCart}
            className={`p-2.5 rounded-xl font-medium text-xs flex items-center justify-center transition shadow-xs ${
              product.countInStock === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-brand-600 hover:bg-brand-700 text-white active:scale-95'
            }`}
            title="Add to Cart"
          >
            {isAddingToCart ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
