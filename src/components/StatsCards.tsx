import React from 'react';
import { Globe2, Users, Map, Maximize2 } from 'lucide-react';
import type { CountryStats } from '../types/country';
import { formatCompactNumber, formatNumber } from '../utils/countryUtils';

interface StatsCardsProps {
  stats: CountryStats;
  isLoading?: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, isLoading = false }) => {
  const cards = [
    {
      id: 'countries',
      label: 'Total Countries',
      value: isLoading ? '...' : formatNumber(stats.totalCountries),
      compact: `${stats.totalCountries} Nations`,
      icon: Globe2,
      color: 'from-blue-500 to-indigo-600',
      iconColor: 'text-blue-400 light:text-blue-600',
      borderColor: 'border-blue-500/20',
    },
    {
      id: 'population',
      label: 'Total Population',
      value: isLoading ? '...' : formatCompactNumber(stats.totalPopulation),
      subtext: isLoading ? '' : `${formatNumber(stats.totalPopulation)} inhabitants`,
      icon: Users,
      color: 'from-indigo-500 to-purple-600',
      iconColor: 'text-indigo-400 light:text-indigo-600',
      borderColor: 'border-indigo-500/20',
    },
    {
      id: 'regions',
      label: 'Number of Regions',
      value: isLoading ? '...' : stats.totalRegions.toString(),
      subtext: 'Global Continents & Zones',
      icon: Map,
      color: 'from-teal-500 to-emerald-600',
      iconColor: 'text-teal-400 light:text-teal-600',
      borderColor: 'border-teal-500/20',
    },
    {
      id: 'area',
      label: 'Total Area',
      value: isLoading ? '...' : `${formatCompactNumber(stats.totalArea)} km²`,
      subtext: isLoading ? '' : `${formatNumber(stats.totalArea)} sq km`,
      icon: Maximize2,
      color: 'from-amber-500 to-rose-600',
      iconColor: 'text-amber-400 light:text-amber-600',
      borderColor: 'border-amber-500/20',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className={`p-5 rounded-2xl glass-card relative overflow-hidden transition-all duration-300 group border ${card.borderColor}`}
            >
              {/* Subtle top indicator bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.color} opacity-80`} />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 light:text-slate-500">
                    {card.label}
                  </p>
                  <div className="mt-1 flex items-baseline gap-2">
                    {isLoading ? (
                      <div className="h-8 w-24 rounded-lg skeleton-shimmer my-1" />
                    ) : (
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100 light:text-slate-900 tracking-tight">
                        {card.value}
                      </h3>
                    )}
                  </div>
                  {card.subtext && !isLoading && (
                    <p className="mt-1 text-[11px] text-slate-400 light:text-slate-500 font-medium truncate" title={card.subtext}>
                      {card.subtext}
                    </p>
                  )}
                </div>

                <div className={`p-3 rounded-2xl bg-slate-800/60 light:bg-slate-100/80 border border-slate-700/50 light:border-slate-200 group-hover:scale-110 transition-transform duration-300 ${card.iconColor}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
