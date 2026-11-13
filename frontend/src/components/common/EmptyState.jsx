import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = ShoppingBag,
  title = 'No items found',
  description = 'Looks like there is nothing here yet.',
  actionText = 'Explore Products',
  actionLink = '/shop',
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 mb-5 shadow-inner">
        <Icon className="w-10 h-10 stroke-[1.5]" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-sm mb-6 text-sm leading-relaxed">{description}</p>
      {actionLink ? (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm transition shadow-sm hover:shadow"
        >
          {actionText}
          <ArrowRight className="w-4 h-4" />
        </Link>
      ) : onAction ? (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm transition shadow-sm hover:shadow"
        >
          {actionText}
          <ArrowRight className="w-4 h-4" />
        </button>
      ) : null}
    </div>
  );
};
