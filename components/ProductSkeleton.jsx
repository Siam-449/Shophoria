import React from 'react';

const ProductSkeleton = () => (
    <div className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col animate-pulse">
        <div className="aspect-square bg-slate-200 dark:bg-slate-800"></div>
        <div className="p-3 flex flex-col flex-grow">
            <div className="flex-grow">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full mb-1"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
            </div>
            <div className="mt-2">
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mb-2"></div>
              <div className="h-9 bg-slate-300 dark:bg-slate-700 rounded-md w-full"></div>
            </div>
        </div>
    </div>
);

export default ProductSkeleton;
