import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, Heart, BarChart3, Info, RefreshCw, Globe2, Menu, X } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  onRefreshApi?: () => void;
  isRefreshing?: boolean;
  isFromCache?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onRefreshApi, isRefreshing = false, isFromCache = false }) => {
  const { favoriteCount } = useFavorites();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-blue-600/15 text-blue-500 dark:text-blue-400 border border-blue-500/30 shadow-sm'
        : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-slate-100 light:hover:text-slate-900 hover:bg-slate-800/40 light:hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 light:border-slate-200/80 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <NavLink to="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1" onClick={closeMobileMenu}>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-400 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-slate-950 light:bg-white rounded-[14px] flex items-center justify-center">
              <Globe2 className="w-6 h-6 text-blue-400 light:text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-300 light:from-slate-900 light:to-blue-700 bg-clip-text text-transparent">
                APIVerse
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 light:text-blue-600 border border-blue-500/20">
                REST API
              </span>
            </div>
            <p className="text-xs text-slate-400 light:text-slate-500 hidden sm:block">
              Explore the World Through REST APIs
            </p>
          </div>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
          <NavLink to="/" className={navLinkClass}>
            <Compass className="w-4 h-4" />
            <span>Explore</span>
          </NavLink>

          <NavLink to="/favorites" className={navLinkClass}>
            <div className="relative flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Favorites</span>
              {favoriteCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white shadow-sm">
                  {favoriteCount}
                </span>
              )}
            </div>
          </NavLink>

          <NavLink to="/analytics" className={navLinkClass}>
            <BarChart3 className="w-4 h-4 text-teal-400" />
            <span>Analytics</span>
          </NavLink>

          <NavLink to="/about" className={navLinkClass}>
            <Info className="w-4 h-4" />
            <span>About</span>
          </NavLink>
        </nav>

        {/* Actions (Refresh, Theme, Mobile Toggle) */}
        <div className="flex items-center gap-2.5">
          {onRefreshApi && (
            <button
              onClick={onRefreshApi}
              disabled={isRefreshing}
              type="button"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border border-slate-700/60 light:border-slate-300 bg-slate-800/50 light:bg-slate-100 hover:bg-slate-700/60 light:hover:bg-slate-200 text-slate-300 light:text-slate-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              title={isFromCache ? 'Cached payload active. Click to bypass cache and fetch live API data' : 'Fetch fresh API data'}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">{isRefreshing ? 'Fetching...' : 'Refresh API'}</span>
              {isFromCache && (
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm" title="Data loaded from local cache" />
              )}
            </button>
          )}

          <ThemeToggle />

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="md:hidden p-2 rounded-xl border border-slate-700/60 light:border-slate-300 text-slate-300 light:text-slate-700 hover:bg-slate-800 light:hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 light:border-slate-200 bg-slate-900/95 light:bg-white/95 backdrop-blur-xl px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <NavLink to="/" className={navLinkClass} onClick={closeMobileMenu}>
            <Compass className="w-5 h-5" />
            <span>Explore</span>
          </NavLink>
          <NavLink to="/favorites" className={navLinkClass} onClick={closeMobileMenu}>
            <Heart className="w-5 h-5 text-rose-500" />
            <span className="flex-1">Favorites</span>
            {favoriteCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white">
                {favoriteCount}
              </span>
            )}
          </NavLink>
          <NavLink to="/analytics" className={navLinkClass} onClick={closeMobileMenu}>
            <BarChart3 className="w-5 h-5 text-teal-400" />
            <span>Analytics</span>
          </NavLink>
          <NavLink to="/about" className={navLinkClass} onClick={closeMobileMenu}>
            <Info className="w-5 h-5" />
            <span>About APIVerse</span>
          </NavLink>
        </div>
      )}
    </header>
  );
};
