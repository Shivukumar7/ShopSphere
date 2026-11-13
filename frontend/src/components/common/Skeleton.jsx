import React from 'react';

export const Skeleton = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-slate-200 rounded-md ${className}`} />
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col space-y-3">
      <Skeleton className="w-full aspect-square rounded-xl" />
      <Skeleton className="w-1/3 h-4" />
      <Skeleton className="w-4/5 h-5" />
      <Skeleton className="w-1/2 h-4" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="w-1/3 h-6" />
        <Skeleton className="w-20 h-9 rounded-xl" />
      </div>
    </div>
  );
};

export const BannerSkeleton = () => {
  return (
    <div className="w-full h-80 sm:h-96 rounded-3xl animate-pulse bg-slate-200" />
  );
};
