import React, { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, Compass, Trash2, Search } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useCountries } from '../hooks/useCountries';
import { CountryGrid } from '../components/CountryGrid';
import { CountryDetailsModal } from '../components/CountryDetailsModal';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import type { Country } from '../types/country';

export const Favorites: React.FC = () => {
  const { favorites, favoriteCount, clearFavorites } = useFavorites();
  const { allCountries, isLoading } = useCountries();

  const [favSearch, setFavSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  // Filter full country list by favorite cca3 codes
  const favoritedCountries = useMemo(() => {
    return allCountries.filter((c) => favorites.includes(c.cca3));
  }, [allCountries, favorites]);

  // Apply search query within favorites
  const filteredFavs = useMemo(() => {
    if (!favSearch.trim()) return favoritedCountries;
    const query = favSearch.toLowerCase();
    return favoritedCountries.filter(
      (c) =>
        c.name.common.toLowerCase().includes(query) ||
        c.name.official.toLowerCase().includes(query) ||
        c.region.toLowerCase().includes(query) ||
        c.cca3.toLowerCase().includes(query)
    );
  }, [favoritedCountries, favSearch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 light:border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-lg shadow-rose-500/10">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 light:text-slate-900 tracking-tight">
                Favorite Countries
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600 mt-0.5">
                Saved bookmarks stored locally in your browser
              </p>
            </div>
          </div>
        </div>

        {favoriteCount > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={clearFavorites}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 light:text-rose-600 border border-rose-500/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All Favorites</span>
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : favoritedCountries.length === 0 ? (
        /* Empty Favorites State */
        <div className="max-w-md mx-auto my-16 p-8 rounded-3xl glass-card text-center space-y-5 border border-slate-800/80 light:border-slate-200 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center">
            <Heart className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-100 light:text-slate-900">
              No Favorites Saved Yet
            </h3>
            <p className="text-sm text-slate-400 light:text-slate-600 leading-relaxed">
              Explore countries on the home dashboard and click the heart icon on any card to save it here for quick reference.
            </p>
          </div>
          <div className="pt-2">
            <NavLink
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-500 transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Countries</span>
            </NavLink>
          </div>
        </div>
      ) : (
        /* Favorited Grid View */
        <div className="space-y-6">
          {/* Quick Search within favorites */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={favSearch}
              onChange={(e) => setFavSearch(e.target.value)}
              placeholder="Search within your saved favorites..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/60 light:border-slate-300 bg-slate-900/60 light:bg-white text-sm text-slate-100 light:text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <p className="text-xs font-semibold text-slate-400 light:text-slate-600">
            Displaying <strong className="text-rose-400">{filteredFavs.length}</strong> favorited nation{filteredFavs.length === 1 ? '' : 's'}
          </p>

          <CountryGrid
            countries={filteredFavs}
            onSelectCountry={(c) => setSelectedCountry(c)}
          />
        </div>
      )}

      {/* Details Modal */}
      <CountryDetailsModal
        country={selectedCountry}
        allCountries={allCountries}
        onClose={() => setSelectedCountry(null)}
      />
    </div>
  );
};
