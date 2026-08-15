import React from 'react';
import { Sparkles, Database, Layers } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden pt-8 pb-6 px-4 sm:px-6 lg:px-8 text-center sm:text-left">
      {/* Dynamic Background Blurs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 light:text-blue-600 text-xs font-semibold tracking-wide mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>REST Countries API Integration v3.1</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-100 light:text-slate-900 leading-tight">
            Explore Countries <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-teal-300 light:from-blue-600 light:to-indigo-600 bg-clip-text text-transparent">
              Worldwide
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-3 text-base sm:text-lg text-slate-300 light:text-slate-600 leading-relaxed font-normal">
            Search, filter and analyze country information using live REST API data. Real-time metrics, global demographics, and interactive geographical analytics.
          </p>
        </div>

        {/* Hero Features Pills */}
        <div className="flex flex-wrap gap-3 justify-center md:justify-end max-w-sm">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl glass-card text-xs font-medium text-slate-300 light:text-slate-700">
            <Database className="w-4 h-4 text-blue-400" />
            <span>Client-Side Local Storage Caching</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl glass-card text-xs font-medium text-slate-300 light:text-slate-700">
            <Layers className="w-4 h-4 text-teal-400" />
            <span>Multi-Criteria Demographics Filter</span>
          </div>
        </div>
      </div>
    </div>
  );
};
