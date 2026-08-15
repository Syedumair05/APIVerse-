import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Search & Filter Skeleton */}
      <div className="space-y-4">
        <div className="h-14 w-full rounded-2xl skeleton-shimmer" />
        <div className="h-28 w-full rounded-2xl skeleton-shimmer" />
      </div>

      {/* Grid Skeleton Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col rounded-2xl glass-card overflow-hidden border border-slate-800/60 light:border-slate-200 h-96"
          >
            {/* Flag image skeleton */}
            <div className="h-44 w-full skeleton-shimmer" />
            
            {/* Content skeleton */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="h-6 w-3/4 rounded-lg skeleton-shimmer" />
                <div className="h-4 w-1/2 rounded-lg skeleton-shimmer" />
                
                <div className="mt-4 space-y-2">
                  <div className="h-4 w-full rounded-lg skeleton-shimmer" />
                  <div className="h-4 w-5/6 rounded-lg skeleton-shimmer" />
                  <div className="h-4 w-4/6 rounded-lg skeleton-shimmer" />
                </div>
              </div>

              <div className="h-10 w-full rounded-xl skeleton-shimmer" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
