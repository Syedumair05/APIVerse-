import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  onReset: () => void;
  title?: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onReset,
  title = 'No Countries Found',
  description = 'No country entries match your current search query or active filter settings.',
}) => {
  return (
    <div className="max-w-md mx-auto my-12 p-8 rounded-3xl glass-card border border-slate-800/80 light:border-slate-200 text-center space-y-5 animate-in fade-in duration-300">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
        <SearchX className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-slate-100 light:text-slate-900">
          {title}
        </h3>
        <p className="text-sm text-slate-400 light:text-slate-600 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="pt-2">
        <button
          onClick={onReset}
          type="button"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs bg-slate-800 light:bg-slate-200 hover:bg-blue-600 light:hover:bg-blue-600 text-slate-200 light:text-slate-800 hover:text-white light:hover:text-white border border-slate-700 light:border-slate-300 transition-all duration-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Search & Filters</span>
        </button>
      </div>
    </div>
  );
};
