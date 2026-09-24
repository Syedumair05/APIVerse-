import React, { useEffect } from 'react';
import { X, Heart, Globe, MapPin, Users, Maximize2, Building2, Coins, Languages as LangIcon, Award, ExternalLink } from 'lucide-react';
import type { Country } from '../types/country';
import { calculateDensity, formatCurrencies, formatLanguages, formatNumber, getPopulationRank } from '../utils/countryUtils';
import { useFavorites } from '../context/FavoritesContext';

interface CountryDetailsModalProps {
  country: Country | null;
  allCountries: Country[];
  onClose: () => void;
}

export const CountryDetailsModal: React.FC<CountryDetailsModalProps> = ({
  country,
  allCountries,
  onClose,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (country) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [country, onClose]);

  if (!country) return null;

  const favorited = isFavorite(country.cca3);
  const popRank = getPopulationRank(country.cca3, allCountries);
  const density = calculateDensity(country.population, country.area);
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(country.name.common)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Dialog Card Container */}
      <div
        className="relative w-full max-w-3xl rounded-3xl glass-panel border border-slate-700/60 light:border-slate-300 shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-900 light:bg-slate-100 overflow-hidden">
          <img
            src={country.flags.svg || country.flags.png}
            alt={country.flags.alt || `Flag of ${country.name.common}`}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Top Control Action Buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-3">
            <button
              onClick={() => toggleFavorite(country.cca3)}
              type="button"
              className={`p-2.5 rounded-full backdrop-blur-md border transition-all duration-200 ${
                favorited
                  ? 'bg-rose-500 text-white border-rose-400'
                  : 'bg-slate-950/60 light:bg-white/80 text-slate-300 light:text-slate-600 border-slate-700/50 hover:text-rose-500'
              }`}
              title={favorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-5 h-5 ${favorited ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={onClose}
              type="button"
              className="p-2.5 rounded-full bg-slate-950/60 light:bg-white/80 backdrop-blur-md border border-slate-700/50 text-slate-300 light:text-slate-600 hover:text-white light:hover:text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/30 text-blue-300 border border-blue-400/30 backdrop-blur-md">
                {country.region}
              </span>
              {country.subregion && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800/60 text-slate-300 border border-slate-700/40 backdrop-blur-md">
                  {country.subregion}
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">
              {country.name.common}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-normal italic">
              {country.name.official}
            </p>
          </div>
        </div>

        {/* Modal Main Information Grid */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Derived Badges (Rank & Density) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-slate-800/40 light:bg-slate-100 border border-slate-700/40 light:border-slate-200 flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400 light:text-slate-500 uppercase tracking-wider">
                  Global Population Rank
                </p>
                <p className="text-base font-bold text-slate-100 light:text-slate-900">
                  #{popRank} <span className="text-xs font-normal text-slate-400">of {allCountries.length} countries</span>
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/40 light:bg-slate-100 border border-slate-700/40 light:border-slate-200 flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400 light:text-slate-500 uppercase tracking-wider">
                  Population Density
                </p>
                <p className="text-base font-bold text-slate-100 light:text-slate-900">
                  {density}
                </p>
              </div>
            </div>
          </div>

          {/* Details Specifications Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
            
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs text-slate-400 light:text-slate-500 block">Capital City</span>
                <span className="font-semibold text-slate-100 light:text-slate-900">
                  {country.capital?.join(', ') || 'N/A'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs text-slate-400 light:text-slate-500 block">Country Code (CCA3)</span>
                <span className="font-semibold font-mono text-slate-100 light:text-slate-900">
                  {country.cca3}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs text-slate-400 light:text-slate-500 block">Total Population</span>
                <span className="font-semibold text-slate-100 light:text-slate-900">
                  {formatNumber(country.population)}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Maximize2 className="w-5 h-5 text-teal-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs text-slate-400 light:text-slate-500 block">Total Surface Area</span>
                <span className="font-semibold text-slate-100 light:text-slate-900">
                  {formatNumber(country.area)} sq km
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Coins className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs text-slate-400 light:text-slate-500 block">Currencies</span>
                <span className="font-semibold text-slate-100 light:text-slate-900">
                  {formatCurrencies(country.currencies)}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <LangIcon className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs text-slate-400 light:text-slate-500 block">Official Languages</span>
                <span className="font-semibold text-slate-100 light:text-slate-900">
                  {formatLanguages(country.languages)}
                </span>
              </div>
            </div>

          </div>

          {/* Footer External Links & Close */}
          <div className="pt-4 border-t border-slate-800 light:border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs bg-blue-600/15 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 transition-all duration-200"
            >
              <MapPin className="w-4 h-4" />
              <span>Explore on Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              type="button"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-xs bg-slate-800 light:bg-slate-200 hover:bg-slate-700 light:hover:bg-slate-300 text-slate-200 light:text-slate-800 transition-all duration-200"
            >
              Close Details
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
