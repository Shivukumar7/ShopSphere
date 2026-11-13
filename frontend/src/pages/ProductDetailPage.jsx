import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { RatingStars } from '../components/product/RatingStars';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency, calculateDiscountPercentage, formatDate } from '../utils/formatters';
import {
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RefreshCw,
  Plus,
  Minus,
  Check,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Send,
} from 'lucide-react';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Review form
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${id}`);
        if (res.data.success) {
          setProduct(res.data.product);
          setReviews(res.data.reviews || []);
          setSelectedImage(res.data.product.images?.[0] || '');
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      return navigate(`/login?redirect=/product/${id}`);
    }
    if (!comment.trim()) {
      return showToast('Please enter your review comment', 'warning');
    }

    setSubmittingReview(true);
    try {
      const res = await api.post(`/products/${id}/reviews`, { rating, comment });
      if (res.data.success) {
        showToast('Review submitted successfully!', 'success');
        setReviews([res.data.review, ...reviews]);
        setComment('');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <Link to="/shop" className="inline-flex items-center gap-2 text-brand-600 font-semibold text-sm">
          <ArrowLeft className="w-4 h-4" /> Return to Shop
        </Link>
      </div>
    );
  }

  const isWishlisted = wishlistIds.includes(product._id);
  const discountPercent = calculateDiscountPercentage(product.discountPrice, product.price);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link to="/" className="hover:text-slate-800">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/shop" className="hover:text-slate-800">Shop</Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link to={`/shop?category=${product.category.slug || product.category._id}`} className="hover:text-slate-800">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-white rounded-3xl border border-slate-200/80 p-8 flex items-center justify-center overflow-hidden shadow-xs relative">
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-bold bg-rose-500 text-white shadow-xs">
                {discountPercent}% OFF
              </span>
            )}
            <img
              src={selectedImage || product.images?.[0]}
              alt={product.name}
              className="max-h-full max-w-full object-contain transform hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl bg-white border p-2 flex items-center justify-center transition ${
                    selectedImage === img ? 'border-brand-600 ring-2 ring-brand-500/20 shadow-xs' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="max-h-full max-w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                {product.brand}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                product.countInStock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}>
                {product.countInStock > 0 ? `In Stock (${product.countInStock} available)` : 'Out of Stock'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Ratings */}
            <div className="flex items-center gap-4 mt-3">
              <RatingStars rating={product.rating} numReviews={product.numReviews} size="md" />
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs font-medium text-slate-500">
                SKU: SPHERE-{product._id.substring(18).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-baseline gap-3">
            <span className="text-3xl font-black text-slate-900">
              {formatCurrency(product.price)}
            </span>
            {product.discountPrice > product.price && (
              <span className="text-base text-slate-400 line-through">
                {formatCurrency(product.discountPrice)}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-xs font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-md">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 leading-relaxed">
            {product.description}
          </p>

          {/* Quantity and Actions */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-2xs">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 text-slate-500 hover:text-slate-800 disabled:opacity-30"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-sm text-slate-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={quantity >= product.countInStock}
                  onClick={() => setQuantity((q) => Math.min(product.countInStock, q + 1))}
                  className="p-2 text-slate-500 hover:text-slate-800 disabled:opacity-30"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => addToCart(product, quantity)}
                disabled={product.countInStock === 0}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition shadow-lg shadow-brand-600/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-5 h-5" /> Add to Cart
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={product.countInStock === 0}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-2xl border transition flex items-center justify-center ${
                  isWishlisted
                    ? 'border-rose-300 bg-rose-50 text-rose-600'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
              </button>
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <Truck className="w-5 h-5 text-brand-600 mx-auto" />
              <p className="text-[11px] font-bold text-slate-800">Free Delivery</p>
              <p className="text-[10px] text-slate-400">Orders over $50</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <RefreshCw className="w-5 h-5 text-emerald-600 mx-auto" />
              <p className="text-[11px] font-bold text-slate-800">30 Days Returns</p>
              <p className="text-[10px] text-slate-400">Easy refunds</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <ShieldCheck className="w-5 h-5 text-amber-600 mx-auto" />
              <p className="text-[11px] font-bold text-slate-800">100% Authentic</p>
              <p className="text-[10px] text-slate-400">Verified warranty</p>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      {product.specifications && product.specifications.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Technical Specifications</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {product.specifications.map((spec, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
              >
                <span className="font-semibold text-slate-500">{spec.key}</span>
                <span className="font-bold text-slate-800">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Reviews Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Verified Customer Reviews</h3>
            <p className="text-xs text-slate-500 mt-0.5">Based on {reviews.length} ratings and testimonials</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black text-slate-900">{product.rating.toFixed(1)}</span>
            <div className="flex flex-col">
              <RatingStars rating={product.rating} showCount={false} size="sm" />
              <span className="text-[11px] text-slate-400">{reviews.length} reviews</span>
            </div>
          </div>
        </div>

        {/* Add Review Form */}
        <form onSubmit={handleReviewSubmit} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <h4 className="text-sm font-bold text-slate-900">Write a Review</h4>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Rating (1 to 5 Stars)</label>
            <RatingStars
              rating={rating}
              size="md"
              interactive={true}
              onRatingChange={(newRating) => setRating(newRating)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Review Comment</label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or dislike about this product? How did it meet your expectations?"
              className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs placeholder-slate-400 focus:border-brand-600 outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={submittingReview}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition disabled:opacity-60"
          >
            <Send className="w-3.5 h-3.5" /> Submit Review
          </button>
        </form>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((rev) => (
              <div key={rev._id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center uppercase">
                      {rev.name?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{rev.name}</p>
                      <p className="text-[10px] text-slate-400">{formatDate(rev.createdAt)}</p>
                    </div>
                  </div>
                  <RatingStars rating={rev.rating} showCount={false} size="xs" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-10">{rev.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 py-4 text-center">
              No reviews yet. Be the first to share your thoughts on this product!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
