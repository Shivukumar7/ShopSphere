import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { AdminNav } from '../../components/admin/AdminNav';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { stats, recentOrders } = data || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Admin Nav */}
      <AdminNav />

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Executive Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Store performance, revenue analytics, and order operations summary
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Revenue */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Revenue</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(stats?.totalRevenue || 0)}</h3>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +12.5% vs last month
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Orders</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats?.totalOrders || 0}</h3>
            <Link to="/admin/orders" className="text-[11px] text-brand-600 font-semibold hover:underline block mt-1">
              View all orders →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-brand-600 flex items-center justify-center">
            <ShoppingCart className="w-6 h-6" />
          </div>
        </div>

        {/* Customers */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Customers</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats?.totalCustomers || 0}</h3>
            <span className="text-[11px] text-slate-400 mt-1 block">Registered shoppers</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Products Catalog</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats?.totalProducts || 0}</h3>
            {stats?.lowStockProducts > 0 ? (
              <span className="text-[11px] text-amber-600 font-semibold flex items-center gap-1 mt-1">
                <AlertTriangle className="w-3.5 h-3.5" /> {stats.lowStockProducts} low stock items
              </span>
            ) : (
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">All stock healthy</span>
            )}
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Status Breakdown Bar */}
      {stats?.statusBreakdown && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Order Fulfillment Pipeline</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
            <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100">
              <span className="text-amber-800 font-extrabold text-lg block">{stats.statusBreakdown.processing}</span>
              <span className="text-slate-500 font-medium">Processing</span>
            </div>
            <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100">
              <span className="text-blue-800 font-extrabold text-lg block">{stats.statusBreakdown.confirmed}</span>
              <span className="text-slate-500 font-medium">Confirmed</span>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100">
              <span className="text-indigo-800 font-extrabold text-lg block">{stats.statusBreakdown.shipped}</span>
              <span className="text-slate-500 font-medium">Shipped</span>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-emerald-800 font-extrabold text-lg block">{stats.statusBreakdown.delivered}</span>
              <span className="text-slate-500 font-medium">Delivered</span>
            </div>
            <div className="p-3 rounded-2xl bg-rose-50/60 border border-rose-100">
              <span className="text-rose-800 font-extrabold text-lg block">{stats.statusBreakdown.cancelled}</span>
              <span className="text-slate-500 font-medium">Cancelled</span>
            </div>
          </div>
        </div>
      )}

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Recent Customer Orders</h2>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1"
          >
            All Orders <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-2">Order ID</th>
                <th className="py-3 px-2">Customer</th>
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Payment</th>
                <th className="py-3 px-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders && recentOrders.length > 0 ? (
                recentOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-2 font-mono font-bold text-slate-900">
                      <Link to={`/order/${ord._id}`} className="hover:text-brand-600">
                        #{ord._id.substring(18)}
                      </Link>
                    </td>
                    <td className="py-3.5 px-2 font-medium text-slate-800">
                      {ord.user?.name || 'Customer'}
                    </td>
                    <td className="py-3.5 px-2 text-slate-500">{formatDate(ord.createdAt)}</td>
                    <td className="py-3.5 px-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-2">
                      <span className={`text-[11px] font-semibold ${ord.isPaid ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {ord.paymentMethod} {ord.isPaid ? '(Paid)' : '(Unpaid)'}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-right font-bold text-slate-900">
                      {formatCurrency(ord.totalPrice)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400">
                    No orders logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
