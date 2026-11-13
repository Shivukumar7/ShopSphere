import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { AdminNav } from '../../components/admin/AdminNav';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  ShoppingCart,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
} from 'lucide-react';

const STATUSES = ['All', 'Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

export const AdminOrdersPage = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/orders${selectedStatus !== 'All' ? `?status=${selectedStatus}` : ''}`);
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/admin/orders/${orderId}`, {
        status: newStatus,
        note: `Status updated to ${newStatus} by admin`,
      });
      if (res.data.success) {
        showToast(`Order status updated to ${newStatus}`, 'success');
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? res.data.order : o))
        );
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      <AdminNav />

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Order Operations & Fulfillment
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor incoming customer orders, manage dispatches, and update delivery statuses
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200">
        {STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedStatus === status
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Change Status</th>
                <th className="py-3 px-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      <Link to={`/order/${ord._id}`} className="hover:text-brand-600">
                        #{ord._id.substring(18)}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800">{ord.shippingAddress?.fullName || ord.user?.name || 'Customer'}</p>
                      <p className="text-[11px] text-slate-400">{ord.shippingAddress?.phone}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {ord.shippingAddress?.city}, {ord.shippingAddress?.state}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {formatDate(ord.createdAt)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`font-semibold ${ord.isPaid ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {ord.paymentMethod} {ord.isPaid ? '(Paid)' : '(COD)'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-200 outline-none cursor-pointer ${
                          ord.orderStatus === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : ord.orderStatus === 'Cancelled'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : ord.orderStatus === 'Shipped'
                            ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                      {formatCurrency(ord.totalPrice)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No orders found in status "{selectedStatus}".
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
