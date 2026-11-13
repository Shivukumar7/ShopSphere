import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';
import { EmptyState } from '../components/common/EmptyState';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Tag,
} from 'lucide-react';

export const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    if (promoCode.trim().toUpperCase() === 'SPHERE10') {
      const discount = Number((cart.itemsPrice * 0.1).toFixed(2));
      setDiscountAmount(discount);
      setPromoApplied(true);
    } else {
      setPromoError('Invalid promo code. Try "SPHERE10" for 10% off');
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-fade-in">
        <EmptyState
          icon={ShoppingBag}
          title="Your Cart is Empty"
          description="Looks like you haven't added any items to your cart yet. Explore our latest arrivals and deals."
          actionText="Start Shopping"
          actionLink="/shop"
        />
      </div>
    );
  }

  const finalTotal = Math.max(0, cart.totalPrice - discountAmount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in space-y-8">
      {/* Title Bar */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            You have {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1.5 transition"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.items.map((item) => {
            const product = item.product || {};
            const productId = product._id || item.product;
            const itemPrice = product.price || item.price || 0;
            const imageUrl = product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';

            return (
              <div
                key={productId}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-5 justify-between"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <Link
                    to={`/product/${productId}`}
                    className="w-20 h-20 bg-slate-50 rounded-xl p-2 flex items-center justify-center flex-shrink-0 border border-slate-100"
                  >
                    <img
                      src={imageUrl}
                      alt={product.name || 'Product'}
                      className="max-h-full max-w-full object-contain"
                    />
                  </Link>
                  <div className="space-y-1 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
                      {product.brand || 'ShopSphere'}
                    </span>
                    <Link
                      to={`/product/${productId}`}
                      className="block text-sm font-semibold text-slate-900 hover:text-brand-600 line-clamp-1 transition"
                    >
                      {product.name || 'Product Item'}
                    </Link>
                    <p className="text-xs font-bold text-slate-700 sm:hidden">
                      {formatCurrency(itemPrice)} each
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
                  {/* Quantity controls */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50/50">
                    <button
                      onClick={() => updateQuantity(productId, item.quantity - 1)}
                      className="p-1.5 text-slate-500 hover:text-slate-900"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(productId, item.quantity + 1)}
                      className="p-1.5 text-slate-500 hover:text-slate-900"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[80px]">
                    <span className="text-base font-extrabold text-slate-900">
                      {formatCurrency(itemPrice * item.quantity)}
                    </span>
                    <span className="text-[11px] text-slate-400 block hidden sm:block">
                      {formatCurrency(itemPrice)} / unit
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(productId)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>

          {/* Promo code form */}
          <form onSubmit={handleApplyPromo} className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Coupon (try SPHERE10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs uppercase font-medium rounded-xl border border-slate-200 outline-none focus:border-brand-600"
                />
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition"
              >
                Apply
              </button>
            </div>
            {promoApplied && (
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Coupon SPHERE10 applied (-10%)
              </p>
            )}
            {promoError && (
              <p className="text-[11px] text-rose-600">{promoError}</p>
            )}
          </form>

          {/* Breakdown */}
          <div className="space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-4">
            <div className="flex justify-between">
              <span>Subtotal ({cart.totalItems} items)</span>
              <span className="font-semibold text-slate-900">{formatCurrency(cart.itemsPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Estimate</span>
              <span className="font-semibold text-slate-900">
                {cart.shippingPrice === 0 ? (
                  <span className="text-emerald-600 uppercase font-bold">Free</span>
                ) : (
                  formatCurrency(cart.shippingPrice)
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Sales Tax (8%)</span>
              <span className="font-semibold text-slate-900">{formatCurrency(cart.taxPrice)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount Promo</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-extrabold text-slate-900 border-t border-slate-200 pt-3">
              <span>Total</span>
              <span>{formatCurrency(finalTotal)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition shadow-lg shadow-brand-600/25 flex items-center justify-center gap-2"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </button>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3 text-xs text-slate-500">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>Guaranteed Safe & Secure Checkout via Razorpay & COD</span>
          </div>
        </div>
      </div>
    </div>
  );
};
