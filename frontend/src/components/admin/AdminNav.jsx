import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Store,
} from 'lucide-react';

export const AdminNav = () => {
  const navItems = [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { to: '/admin/customers', label: 'Customers', icon: Users },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-2 shadow-xs mb-8 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-1.5 flex-wrap">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          );
        })}
      </div>

      <NavLink
        to="/shop"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition"
      >
        <Store className="w-4 h-4" /> View Storefront
      </NavLink>
    </div>
  );
};
