import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  ArrowLeft,
  XCircle,
  AlertTriangle,
} from 'lucide-react';

const TRACKING_STEPS = ['Processing', 'Confirmed', 'Shipped', 'Delivered'];

export const OrderDetailPage = () => {
  const { id } = useParams();
  const { showToast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        if (res.data.success) {
          setOrder(res.data.order);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    setCancelling(true);
    try {
      const res = await api.put(`/orders/${id}/cancel`, {
        reason: 'Requested by customer',
      });
      if (res.data.success) {
        setOrder(res.data.order);
        setShowCancelConfirm(false);
        showToast('Order cancelled successfully', 'info');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Order Not Found</h2>
        <Link to="/orders" className="text-sm font-semibold text-brand-600 inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Return to My Orders
        </Link>
      </div>
    );
  }

  const isCancelled = order.orderStatus === 'Cancelled';
  const currentStepIdx = TRACKING_STEPS.indexOf(order.orderStatus);
  const canCancel = ['Processing', 'Confirmed'].includes(order.orderStatus);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <Link to="/orders" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to My Orders
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Order #{order._id}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Placed on {formatDateTime(order.createdAt)}
          </p>
        </div>

        {canCancel && (
          <button
            onClick={() => setShowCancelConfirm(true)}
            className="px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold text-xs transition"
          >
            Cancel Order
          </button>
        )}
      </div>

      {/* Tracking Stepper */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-slate-900">Fulfillment Status</h2>

        {isCancelled ? (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3 text-xs font-medium">
            <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>This order was cancelled. Items have been restored to available inventory.</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRACKING_STEPS.map((step, idx) => {
              const isCompleted = currentStepIdx >= idx;
              const isCurrent = currentStepIdx === idx;

              return (
                <div
                  key={step}
                  className={`p-4 rounded-2xl border text-center transition ${
                    isCurrent
                      ? 'border-brand-600 bg-brand-50/50'
                      : isCompleted
                      ? 'border-emerald-200 bg-emerald-50/30'
                      : 'border-slate-200 bg-slate-50/30 opacity-50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full mx-auto flex items-center justify-center mb-2">
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <Clock className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{step}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {isCompleted ? 'Completed' : 'Pending'}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid: Items & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items List */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Ordered Items</h2>

          <div className="divide-y divide-slate-100">
            {order.orderItems.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl bg-slate-50 p-1 object-contain border border-slate-100"
                  />
                  <div>
                    <h4 className="font-semibold text-xs sm:text-sm text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-400">Qty: {item.qty} × {formatCurrency(item.price)}</p>
                  </div>
                </div>
                <span className="font-bold text-xs sm:text-sm text-slate-900">
                  {formatCurrency(item.price * item.qty)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Payment Summary */}
        <div className="lg:col-span-4 space-y-6">
          {/* Destination */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs text-xs space-y-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-brand-600" /> Delivery Address
            </h3>
            <p className="font-semibold text-slate-800">{order.shippingAddress?.fullName}</p>
            <p className="text-slate-500">{order.shippingAddress?.street}</p>
            <p className="text-slate-500">
              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
            </p>
            <p className="text-slate-500">{order.shippingAddress?.country}</p>
            <p className="text-slate-500 pt-1">Phone: {order.shippingAddress?.phone}</p>
          </div>

          {/* Payment breakdown */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs text-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-brand-600" /> Payment Details
            </h3>
            <div className="space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span>Method</span>
                <span className="font-semibold text-slate-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span className={`font-semibold ${order.isPaid ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {order.isPaid ? 'Paid' : 'Pending Payment'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span>{formatCurrency(order.itemsPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{order.shippingPrice === 0 ? 'Free' : formatCurrency(order.shippingPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatCurrency(order.taxPrice)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-100 pt-2">
                <span>Total</span>
                <span>{formatCurrency(order.totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-xl space-y-4 animate-fade-in text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Cancel this order?</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to cancel order #{order._id}? Reserved products will be released.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                No, Keep It
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
