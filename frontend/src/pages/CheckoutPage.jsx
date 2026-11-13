import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/formatters';
import api from '../services/api';
import {
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Lock,
  ArrowRight,
  Plus,
} from 'lucide-react';

export const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Shipping form state
  const defaultAddr = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0] || {};
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(defaultAddr.street || '');
  const [city, setCity] = useState(defaultAddr.city || '');
  const [state, setState] = useState(defaultAddr.state || '');
  const [postalCode, setPostalCode] = useState(defaultAddr.postalCode || '');
  const [country, setCountry] = useState(defaultAddr.country || 'United States');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'Razorpay' or 'COD'
  const [submitting, setSubmitting] = useState(false);

  if (!cart.items || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleSavedAddressSelect = (addr) => {
    setStreet(addr.street);
    setCity(addr.city);
    setState(addr.state);
    setPostalCode(addr.postalCode);
    setCountry(addr.country);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!street || !city || !postalCode || !fullName || !phone) {
      return showToast('Please complete all required shipping fields', 'warning');
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        orderItems: cart.items.map((item) => ({
          name: item.product?.name || item.name,
          qty: item.quantity,
          image: item.product?.images?.[0] || '',
          price: item.product?.price || item.price,
          product: item.product?._id || item.product,
        })),
        shippingAddress: {
          fullName,
          phone,
          street,
          city,
          state,
          postalCode,
          country,
        },
        paymentMethod,
      };

      const res = await api.post('/orders', orderPayload);

      if (!res.data.success) {
        throw new Error(res.data.message || 'Order creation failed');
      }

      const createdOrder = res.data.order;

      // If Cash on delivery
      if (paymentMethod === 'COD') {
        clearCart();
        showToast('Order placed successfully via Cash on Delivery!', 'success');
        return navigate(`/order-success/${createdOrder._id}`);
      }

      // If Razorpay test flow
      if (paymentMethod === 'Razorpay') {
        const rzpOrderRes = await api.post('/payments/razorpay-order', {
          orderId: createdOrder._id,
        });

        const { razorpayOrder, keyId } = rzpOrderRes.data;

        // Check if Razorpay JS SDK loaded
        if (typeof window.Razorpay !== 'undefined') {
          const options = {
            key: keyId,
            amount: razorpayOrder.amount,
            currency: 'INR',
            name: 'ShopSphere E-Commerce',
            description: `Order #${createdOrder._id}`,
            order_id: razorpayOrder.id,
            handler: async function (response) {
              try {
                const verifyRes = await api.post('/payments/razorpay-verify', {
                  orderId: createdOrder._id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                });
                if (verifyRes.data.success) {
                  clearCart();
                  showToast('Payment verified successfully!', 'success');
                  navigate(`/order-success/${createdOrder._id}`);
                }
              } catch (verErr) {
                showToast(verErr.message, 'error');
              }
            },
            prefill: {
              name: fullName,
              email: user?.email,
              contact: phone,
            },
            theme: {
              color: '#4f46e5',
            },
            modal: {
              ondismiss: function () {
                showToast('Payment was cancelled. Order pending payment in history.', 'info');
                navigate(`/order/${createdOrder._id}`);
              },
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          // Fallback test simulation if external script blocked
          const verifyRes = await api.post('/payments/razorpay-verify', {
            orderId: createdOrder._id,
            razorpay_order_id: razorpayOrder.id,
            razorpay_payment_id: `pay_sim_${Date.now()}`,
            razorpay_signature: 'test_signature_valid',
          });
          clearCart();
          showToast('Payment completed in test sandbox mode!', 'success');
          navigate(`/order-success/${createdOrder._id}`);
        }
      }
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in space-y-8">
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Secure Checkout
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review your shipping destination and select your preferred payment mode
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Shipping & Payment Form */}
        <div className="lg:col-span-8 space-y-8">
          {/* Saved Addresses quick select */}
          {user?.addresses && user.addresses.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-600" /> Saved Delivery Addresses
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {user.addresses.map((addr, idx) => (
                  <button
                    key={addr._id || idx}
                    type="button"
                    onClick={() => handleSavedAddressSelect(addr)}
                    className="p-3 text-left rounded-2xl border border-slate-200 hover:border-brand-500 bg-slate-50/50 hover:bg-brand-50/30 transition text-xs space-y-0.5"
                  >
                    <p className="font-bold text-slate-900">{addr.street}</p>
                    <p className="text-slate-500">{addr.city}, {addr.state} {addr.postalCode}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Shipping Address Inputs */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-brand-600" /> Delivery Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address</label>
              <input
                type="text"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="House / Apartment number and street"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-600 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">State / Province</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-600 outline-none"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-600 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-brand-600" /> Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* COD */}
              <label
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition ${
                  paymentMethod === 'COD'
                    ? 'border-brand-600 bg-brand-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="mt-1 text-brand-600 focus:ring-brand-500"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Cash on Delivery (COD)</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Pay with cash upon package arrival at your doorstep</p>
                </div>
              </label>

              {/* Razorpay */}
              <label
                onClick={() => setPaymentMethod('Razorpay')}
                className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition ${
                  paymentMethod === 'Razorpay'
                    ? 'border-brand-600 bg-brand-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'Razorpay'}
                  onChange={() => setPaymentMethod('Razorpay')}
                  className="mt-1 text-brand-600 focus:ring-brand-500"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Razorpay (Test Payment)</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Instant online payment via Credit/Debit Cards, UPI, Netbanking</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Items Review & Final Cost */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Items in Order</h2>

          {/* Mini list */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cart.items.map((item) => {
              const product = item.product || {};
              const price = product.price || item.price;
              const img = product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';

              return (
                <div key={product._id || item.product} className="flex items-center gap-3 text-xs">
                  <img src={img} alt="Product" className="w-12 h-12 rounded-lg bg-slate-50 p-1 object-contain border border-slate-100" />
                  <div className="flex-1 truncate">
                    <p className="font-semibold text-slate-900 truncate">{product.name}</p>
                    <p className="text-slate-400">Qty: {item.quantity} × {formatCurrency(price)}</p>
                  </div>
                  <span className="font-bold text-slate-900">{formatCurrency(price * item.quantity)}</span>
                </div>
              );
            })}
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-semibold text-slate-900">{formatCurrency(cart.itemsPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="font-semibold text-slate-900">
                {cart.shippingPrice === 0 ? <span className="text-emerald-600 font-bold uppercase">Free</span> : formatCurrency(cart.shippingPrice)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Tax (8%)</span>
              <span className="font-semibold text-slate-900">{formatCurrency(cart.taxPrice)}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-slate-900 border-t border-slate-200 pt-3">
              <span>Total Amount</span>
              <span>{formatCurrency(cart.totalPrice)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition shadow-lg shadow-brand-600/25 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Confirm & Place Order <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
