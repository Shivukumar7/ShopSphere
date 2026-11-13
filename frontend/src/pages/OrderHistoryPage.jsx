import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import { EmptyState } from '../components/common/EmptyState';
import { Package, ChevronRight, Eye } from 'lucide-react';

const STATUS_COLORS = {
  Processing: 'bg-amber-50 text-amber-700 border-amber-200',
  Confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  Shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
};

export const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-fade-in">
        <EmptyState
          icon={Package}
          title="No Orders Yet"
          description="When you place orders on ShopSphere, you will be able to track status and review history here."
          actionText="Start Shopping"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in space-y-8">
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          My Order History
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review your past purchases and track real-time fulfillment status
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition space-y-4"
          >
            {/* Order header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900">Order #{order._id}</span>
                  <span className="text-[11px] text-slate-400 block">Placed on {formatDate(order.createdAt)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[order.orderStatus] || 'bg-slate-100 text-slate-700'}`}>
                  {order.orderStatus}
                </span>
                <span className="text-sm font-extrabold text-slate-900">
                  {formatCurrency(order.totalPrice)}
                </span>
              </div>
            </div>

            {/* Items Thumbnails */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl bg-slate-50 p-1 object-contain border border-slate-100"
                    />
                    <div className="text-xs hidden md:block max-w-[150px] truncate">
                      <p className="font-semibold text-slate-800 truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-400">Qty: {item.qty}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to={`/order/${order._id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-50 hover:bg-brand-50 hover:text-brand-600 text-slate-700 font-semibold text-xs transition flex-shrink-0"
              >
                <Eye className="w-3.5 h-3.5" /> View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
