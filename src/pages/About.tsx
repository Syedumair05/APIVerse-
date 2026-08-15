import React from 'react';
import { Globe2, Code2, Database, ShieldCheck, Cpu, Zap, Layers, Sparkles, ExternalLink } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 pb-20">
      
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Project Documentation & Architecture</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 light:text-slate-900 tracking-tight leading-tight">
          About <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-teal-300 light:from-blue-600 light:to-indigo-600 bg-clip-text text-transparent">APIVerse</span>
        </h1>
        
        <p className="text-base sm:text-lg text-slate-300 light:text-slate-600 leading-relaxed font-normal">
          APIVerse is a modern REST API Explorer designed to showcase live data integration, debounced multi-criteria filtering, local caching strategies, and responsive analytical data visualization.
        </p>
      </div>

      {/* API Technical Specifications Section */}
      <div className="p-8 rounded-3xl glass-card border border-slate-800/80 light:border-slate-200 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 light:border-slate-200 pb-4">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 light:text-slate-900">
              REST API Integration Specifications
            </h2>
            <p className="text-xs text-slate-400 light:text-slate-500">
              Technical details of the consumed public endpoint
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div className="p-4 rounded-2xl bg-slate-900/60 light:bg-slate-100 border border-slate-800 light:border-slate-200 space-y-1">
            <span className="text-xs text-slate-400 light:text-slate-500 font-medium uppercase tracking-wider">
              API Provider & Version
            </span>
            <p className="font-bold text-slate-100 light:text-slate-900 text-base">
              REST Countries API (v3.1)
            </p>
            <p className="text-xs text-slate-400">Public open-access RESTful geographic data service</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 light:bg-slate-100 border border-slate-800 light:border-slate-200 space-y-1">
            <span className="text-xs text-slate-400 light:text-slate-500 font-medium uppercase tracking-wider">
              HTTP Method & Payload Format
            </span>
            <p className="font-bold text-slate-100 light:text-slate-900 text-base flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-mono">GET</span>
              <span>JSON Array of Country Entities</span>
            </p>
            <p className="text-xs text-slate-400">Strictly typed via TypeScript interfaces</p>
          </div>
        </div>

        {/* Endpoint Box */}
        <div className="p-4 rounded-2xl bg-slate-950 light:bg-slate-900 text-slate-200 border border-slate-800 font-mono text-xs overflow-x-auto space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Active Request Endpoint:</span>
            <span className="text-emerald-400 font-semibold">200 OK Response Target</span>
          </div>
          <p className="text-blue-300 font-semibold break-all">
            https://restcountries.com/v3.1/all?fields=name,flags,capital,population,area,region,subregion,currencies,languages,cca3
          </p>
        </div>

        {/* Architecture & Flow */}
        <div className="space-y-4 pt-2">
          <h3 className="text-base font-bold text-slate-100 light:text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>How Frontend Consumes the API</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/40 light:bg-slate-100 border border-slate-800 light:border-slate-200 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">1</div>
              <h4 className="font-bold text-slate-200 light:text-slate-800">Axios Service Layer</h4>
              <p className="text-slate-400 light:text-slate-600 leading-relaxed">
                Centralized <code className="text-blue-300">src/api/countriesApi.ts</code> handles requests, headers, and 12-second timeout standardizations.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/40 light:bg-slate-100 border border-slate-800 light:border-slate-200 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">2</div>
              <h4 className="font-bold text-slate-200 light:text-slate-800">Client-Side Caching</h4>
              <p className="text-slate-400 light:text-slate-600 leading-relaxed">
                Successful API responses are cached in <code className="text-indigo-300">localStorage</code> with 24-hour TTL to save bandwidth. Manual refresh bypasses cache.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/40 light:bg-slate-100 border border-slate-800 light:border-slate-200 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">3</div>
              <h4 className="font-bold text-slate-200 light:text-slate-800">URL & State Management</h4>
              <p className="text-slate-400 light:text-slate-600 leading-relaxed">
                React hook <code className="text-teal-300">useCountries</code> syncs debounced search, region filters, population brackets, and page numbers with browser query params.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack Matrix */}
      <div className="p-8 rounded-3xl glass-card border border-slate-800/80 light:border-slate-200 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 light:border-slate-200 pb-4">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 light:text-slate-900">
              Technology Stack
            </h2>
            <p className="text-xs text-slate-400 light:text-slate-500">
              Modern frontend libraries powering APIVerse
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold">
          {[
            { name: 'React 19', desc: 'UI Architecture', icon: Code2, color: 'text-blue-400' },
            { name: 'TypeScript', desc: 'Strict Type Safety', icon: ShieldCheck, color: 'text-indigo-400' },
            { name: 'Vite', desc: 'Lightning Fast Bundler', icon: Zap, color: 'text-amber-400' },
            { name: 'Tailwind CSS v4', desc: 'Modern Styling Tokens', icon: Sparkles, color: 'text-teal-400' },
            { name: 'Axios', desc: 'HTTP Client Layer', icon: Database, color: 'text-rose-400' },
            { name: 'Recharts', desc: 'Data Visualizations', icon: Layers, color: 'text-purple-400' },
            { name: 'Lucide React', desc: 'Vector Icons Suite', icon: Globe2, color: 'text-emerald-400' },
            { name: 'React Router v7', desc: 'Client Routing & URL Sync', icon: ExternalLink, color: 'text-sky-400' },
          ].map((tech) => {
            const Icon = tech.icon;
            return (
              <div
                key={tech.name}
                className="p-4 rounded-2xl bg-slate-900/60 light:bg-slate-100 border border-slate-800 light:border-slate-200 space-y-1.5 hover:border-blue-500/40 transition-colors"
              >
                <Icon className={`w-5 h-5 ${tech.color}`} />
                <p className="font-bold text-slate-100 light:text-slate-900">{tech.name}</p>
                <p className="text-[11px] text-slate-400 font-normal">{tech.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Developer Card */}
      <div className="p-8 rounded-3xl glass-card border border-blue-500/20 bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-transparent flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-blue-500/20 shrink-0">
            <div className="w-full h-full bg-slate-950 light:bg-white rounded-[14px] flex items-center justify-center font-black text-xl text-blue-400">
              AV
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100 light:text-slate-900">
              APIVerse Project & Portfolio Showcase
            </h3>
            <p className="text-xs text-slate-400 light:text-slate-600 max-w-md mt-0.5">
              Built as a production-quality frontend application showcasing REST API integrations, dynamic state control, accessibility, and high visual excellence.
            </p>
          </div>
        </div>

        <a
          href="https://restcountries.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all shrink-0"
        >
          <span>REST Countries API</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

    </div>
  );
};
