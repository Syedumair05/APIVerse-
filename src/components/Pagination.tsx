import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers range with smart ellipsis
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="mt-8 pt-6 border-t border-slate-800/60 light:border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
      
      {/* Items Range summary */}
      <div className="text-xs text-slate-400 light:text-slate-600 font-medium">
        Showing <strong className="text-slate-200 light:text-slate-800 font-semibold">{startItem}–{endItem}</strong> of{' '}
        <strong className="text-slate-200 light:text-slate-800 font-semibold">{totalItems}</strong> entries
      </div>

      {/* Pagination Control Buttons */}
      <div className="flex items-center gap-1.5" aria-label="Pagination Navigation">
        
        {/* Previous Page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          type="button"
          className="p-2 rounded-xl border border-slate-700/60 light:border-slate-300 bg-slate-800/40 light:bg-slate-100 hover:bg-slate-700 light:hover:bg-slate-200 text-slate-300 light:text-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all duration-200"
          aria-label="Go to previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Number Buttons */}
        {getPageNumbers().map((num, idx) => {
          if (typeof num === 'string') {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 text-slate-500 text-xs">
                ...
              </span>
            );
          }

          const isActive = num === currentPage;

          return (
            <button
              key={num}
              onClick={() => onPageChange(num)}
              type="button"
              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 border border-blue-500'
                  : 'bg-slate-800/40 light:bg-slate-100 text-slate-300 light:text-slate-700 border border-slate-700/60 light:border-slate-300 hover:bg-slate-700 light:hover:bg-slate-200'
              }`}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`Page ${num}`}
            >
              {num}
            </button>
          );
        })}

        {/* Next Page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          type="button"
          className="p-2 rounded-xl border border-slate-700/60 light:border-slate-300 bg-slate-800/40 light:bg-slate-100 hover:bg-slate-700 light:hover:bg-slate-200 text-slate-300 light:text-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all duration-200"
          aria-label="Go to next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
