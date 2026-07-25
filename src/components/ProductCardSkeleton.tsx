import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-2xl p-2.5 sm:p-3.5 border border-slate-200/80 shadow-2xs overflow-hidden relative">
      {/* Shimmer sweep effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-slate-100/60 to-transparent" />

      {/* Image Skeleton Container */}
      <div className="relative aspect-[3/4] bg-slate-100 rounded-xl mb-2.5 overflow-hidden flex flex-col justify-between p-2">
        {/* Top Badges Shimmer */}
        <div className="flex items-center justify-between gap-1 z-10">
          <div className="h-4 w-16 bg-slate-200 rounded-full animate-pulse" />
          <div className="h-4 w-14 bg-slate-200 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Details Area */}
      <div className="flex flex-col flex-1 px-0.5 space-y-2">
        {/* Material Tag */}
        <div className="h-2.5 w-20 bg-slate-200/80 rounded-md animate-pulse" />

        {/* Title Lines */}
        <div className="h-4 w-4/5 bg-slate-200 rounded-md animate-pulse" />

        {/* Single Price Row */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
          <div className="h-3 w-8 bg-slate-200 rounded animate-pulse" />
          <div className="h-5 w-16 bg-slate-200 rounded-md animate-pulse" />
        </div>

        {/* Action Buttons */}
        <div className="space-y-1.5 pt-1">
          <div className="h-8 w-full bg-blue-50 border border-blue-100 rounded-xl animate-pulse" />
          <div className="h-8 w-full bg-slate-100 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}

