import React, { useState } from 'react';
import { Heart, ExternalLink, Users, Maximize2, Building2 } from 'lucide-react';
import type { Country } from '../types/country';
import { formatCompactNumber, formatNumber } from '../utils/countryUtils';
import { useFavorites } from '../context/FavoritesContext';

interface CountryCardProps {
  country: Country;
  onSelect: (country: Country) => void;
}

export const CountryCard: React.FC<CountryCardProps> = ({ country, onSelect }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const favorited = isFavorite(country.cca3);

  const capitalDisplay = country.capital && country.capital.length > 0 ? country.capital[0] : 'N/A';

  return (
    <div className="group relative flex flex-col rounded-2xl glass-card overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-500/10 border border-slate-800/80 light:border-slate-200">
      
      {/* Flag Image Header Container */}
      <div className="relative h-44 w-full bg-slate-900 light:bg-slate-100 overflow-hidden">
        {/* Skeleton while image loads */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 skeleton-shimmer" />
        )}

        {imageError ? (
          <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs font-semibold">
            Flag image unavailable
          </div>
        ) : (
          <img
            src={country.flags.svg || country.flags.png}
            alt={country.flags.alt || `Flag of ${country.name.common}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
          />
        )}

        {/* Region Badge overlay */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/70 light:bg-white/80 backdrop-blur-md text-[11px] font-bold tracking-wide text-blue-400 light:text-blue-600 border border-slate-700/50 light:border-slate-300">
          {country.region}
        </div>

        {/* Favorite Heart Button Overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(country.cca3);
          }}
          type="button"
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 border shadow-md focus:outline-none focus:ring-2 focus:ring-rose-500 ${
            favorited
              ? 'bg-rose-500 text-white border-rose-400 shadow-rose-500/30'
              : 'bg-slate-950/60 light:bg-white/80 text-slate-300 light:text-slate-600 border-slate-700/50 light:border-slate-300 hover:text-rose-500 hover:scale-110'
          }`}
          aria-label={favorited ? `Remove ${country.name.common} from favorites` : `Add ${country.name.common} to favorites`}
          title={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div>
          {/* Country Name */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-bold text-slate-100 light:text-slate-900 group-hover:text-blue-400 light:group-hover:text-blue-600 transition-colors line-clamp-1">
              {country.name.common}
            </h3>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 light:bg-slate-200 text-slate-400 light:text-slate-600">
              {country.cca3}
            </span>
          </div>

          <p className="text-xs text-slate-400 light:text-slate-500 line-clamp-1 italic mt-0.5" title={country.name.official}>
            {country.name.official}
          </p>

          {/* Key Quick Metrics */}
          <div className="mt-4 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300 light:text-slate-700">
              <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="text-slate-400 light:text-slate-500">Capital:</span>
              <span className="font-semibold truncate">{capitalDisplay}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-300 light:text-slate-700">
              <Users className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="text-slate-400 light:text-slate-500">Population:</span>
              <span className="font-semibold" title={formatNumber(country.population)}>
                {formatCompactNumber(country.population)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-300 light:text-slate-700">
              <Maximize2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span className="text-slate-400 light:text-slate-500">Area:</span>
              <span className="font-semibold" title={`${formatNumber(country.area)} sq km`}>
                {formatCompactNumber(country.area)} km²
              </span>
            </div>
          </div>
        </div>

        {/* Card Footer Button */}
        <button
          onClick={() => onSelect(country)}
          type="button"
          className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs bg-slate-800/80 light:bg-slate-100 hover:bg-blue-600 light:hover:bg-blue-600 text-slate-200 light:text-slate-800 hover:text-white light:hover:text-white border border-slate-700/60 light:border-slate-300 hover:border-blue-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span>View Details</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
