import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, ShoppingBag } from 'lucide-react';
import api from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';

export const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-fade-in space-y-6">
      <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
        <CheckCircle2 className="w-12 h-12 stroke-[2.2]" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Thank You For Your Order!
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Your order has been received and is being prepared for dispatch. We will send updates to your email.
        </p>
      </div>

      {order && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs text-left text-xs space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <span className="text-slate-400 block">Order Identifier</span>
              <span className="font-bold text-slate-900 text-sm">#{order._id}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block">Total Amount</span>
              <span className="font-extrabold text-brand-600 text-sm">{formatCurrency(order.totalPrice)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <span className="text-slate-400 block">Payment Method</span>
              <span className="font-semibold text-slate-800">{order.paymentMethod} ({order.isPaid ? 'Paid' : 'Pending Payment'})</span>
            </div>
            <div>
              <span className="text-slate-400 block">Delivery Destination</span>
              <span className="font-semibold text-slate-800 truncate block">
                {order.shippingAddress?.street}, {order.shippingAddress?.city}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Link
          to={`/order/${id}`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-md shadow-brand-600/20"
        >
          <Package className="w-4 h-4" /> Track Order Status
        </Link>
        <Link
          to="/shop"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition"
        >
          <ShoppingBag className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>
    </div>
  );
};
