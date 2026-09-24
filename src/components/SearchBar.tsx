import React, { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  filteredCount: number;
  totalCount: number;
  isDisabled?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  filteredCount,
  totalCount,
  isDisabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Global shortcut '/' to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="w-full">
      <div className="relative flex items-center">
        {/* Search Icon */}
        <div className="absolute left-4 pointer-events-none text-slate-400 light:text-slate-500">
          <Search className="w-5 h-5" />
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isDisabled}
          placeholder="Search by country name, capital, or code (e.g. Japan, Paris, IND)..."
          className="w-full pl-12 pr-28 py-3.5 rounded-2xl border border-slate-700/60 light:border-slate-300 bg-slate-900/60 light:bg-white text-slate-100 light:text-slate-900 placeholder:text-slate-500 light:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base shadow-sm disabled:opacity-50"
          aria-label="Search countries"
        />

        {/* Right Action / Clear & Counter */}
        <div className="absolute right-3 flex items-center gap-2">
          {value ? (
            <button
              onClick={() => onChange('')}
              type="button"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-100 light:hover:text-slate-900 hover:bg-slate-800 light:hover:bg-slate-200 transition-colors focus:outline-none"
              title="Clear search"
              aria-label="Clear search text"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold text-slate-400 light:text-slate-500 bg-slate-800/80 light:bg-slate-100 border border-slate-700/60 light:border-slate-300 rounded-md">
              /
            </kbd>
          )}
        </div>
      </div>

      {/* Result Count Notice */}
      <div className="mt-2.5 flex items-center justify-between text-xs font-medium text-slate-400 light:text-slate-600 px-1">
        <span>
          Showing <strong className="text-blue-400 light:text-blue-600 font-bold">{filteredCount}</strong> of{' '}
          <strong className="text-slate-200 light:text-slate-800 font-semibold">{totalCount}</strong> countries
        </span>
        {value && (
          <span className="text-slate-400 light:text-slate-500">
            Filtered by: &ldquo;<span className="text-slate-200 light:text-slate-800">{value}</span>&rdquo;
          </span>
        )}
      </div>
    </div>
  );
};
