import React from 'react';
import { AlertTriangle, RefreshCw, ServerOff } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Unable to load country data.',
  onRetry,
}) => {
  return (
    <div className="max-w-lg mx-auto my-12 p-8 rounded-3xl glass-card border border-rose-500/30 text-center space-y-5 animate-in zoom-in-95 duration-300">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center shadow-lg shadow-rose-500/10">
        <ServerOff className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-slate-100 light:text-slate-900">
          Unable to Load Country Data
        </h3>
        <p className="text-sm text-slate-400 light:text-slate-600 max-w-sm mx-auto leading-relaxed">
          {message}
        </p>
      </div>

      <div className="pt-2">
        <button
          onClick={onRetry}
          type="button"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 light:text-slate-400 pt-2">
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>Ensure your network connection is active or retry live API fetch.</span>
      </div>
    </div>
  );
};
