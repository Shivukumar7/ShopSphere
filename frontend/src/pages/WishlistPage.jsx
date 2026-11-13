import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/product/ProductCard';
import { EmptyState } from '../components/common/EmptyState';
import { Heart } from 'lucide-react';

export const WishlistPage = () => {
  const { wishlist, wishlistIds, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-fade-in">
        <EmptyState
          icon={Heart}
          title="Your Wishlist is Empty"
          description="Explore our curated catalog and tap the heart icon on any product to save items you love for later."
          actionText="Discover Products"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in space-y-8">
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          My Saved Wishlist
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={addToCart}
            onToggleWishlist={toggleWishlist}
            isWishlisted={wishlistIds.includes(product._id)}
          />
        ))}
      </div>
    </div>
  );
};
