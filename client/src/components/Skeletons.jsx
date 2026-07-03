import React from 'react';

export const BookCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden p-4 shadow-sm animate-pulse flex flex-col justify-between h-full">
      <div>
        <div className="aspect-[3/4] w-full bg-slate-200 rounded-xl mb-4" />
        <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-slate-200 rounded w-1/2 mb-4" />
      </div>
      <div className="flex justify-between items-center mt-2">
        <div className="h-5 bg-slate-200 rounded w-1/4" />
        <div className="h-8 bg-slate-200 rounded-lg w-1/3" />
      </div>
    </div>
  );
};

export const BookDetailSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto p-6 animate-pulse">
      <div className="aspect-[3/4] bg-slate-200 rounded-2xl w-full shadow-inner" />
      <div className="flex flex-col justify-center space-y-5">
        <div className="h-4 bg-slate-200 rounded w-20" />
        <div className="h-9 bg-slate-200 rounded w-5/6" />
        <div className="h-5 bg-slate-200 rounded w-1/3" />
        <div className="space-y-2 mt-4">
          <div className="h-4 bg-slate-200 rounded w-full" />
          <div className="h-4 bg-slate-200 rounded w-full" />
          <div className="h-4 bg-slate-200 rounded w-4/5" />
        </div>
        <div className="flex gap-4 mt-6">
          <div className="h-12 bg-slate-200 rounded-xl w-32" />
          <div className="h-12 bg-slate-200 rounded-xl w-32" />
        </div>
      </div>
    </div>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-10 h-10 bg-slate-200 rounded-xl mb-4" />
            <div className="h-3 bg-slate-200 rounded w-1/2 mb-2" />
            <div className="h-6 bg-slate-200 rounded w-1/3" />
          </div>
        ))}
      </div>
      <div className="h-64 bg-slate-100 rounded-2xl w-full animate-pulse border border-slate-100" />
    </div>
  );
};
