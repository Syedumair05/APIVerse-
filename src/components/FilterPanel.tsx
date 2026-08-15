import React from 'react';
import { Filter, RotateCcw, ArrowUpDown, Globe, Users } from 'lucide-react';
import type { PopulationFilter, RegionFilter, SortOption } from '../types/country';

interface FilterPanelProps {
  region: RegionFilter;
  setRegion: (region: RegionFilter) => void;
  population: PopulationFilter;
  setPopulation: (pop: PopulationFilter) => void;
  sort: SortOption;
  setSort: (sort: SortOption) => void;
  onReset: () => void;
  isDisabled?: boolean;
}

const REGIONS: RegionFilter[] = ['All', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

const POPULATION_RANGES: { label: string; value: PopulationFilter }[] = [
  { label: 'Any Population', value: 'any' },
  { label: 'Under 10 Million', value: 'under10m' },
  { label: '10M – 50 Million', value: '10m-50m' },
  { label: '50M – 100 Million', value: '50m-100m' },
  { label: 'Above 100 Million', value: 'above100m' },
];

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Name (A – Z)', value: 'name-asc' },
  { label: 'Name (Z – A)', value: 'name-desc' },
  { label: 'Population (Low → High)', value: 'pop-asc' },
  { label: 'Population (High → Low)', value: 'pop-desc' },
  { label: 'Area (Low → High)', value: 'area-asc' },
  { label: 'Area (High → Low)', value: 'area-desc' },
];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  region,
  setRegion,
  population,
  setPopulation,
  sort,
  setSort,
  onReset,
  isDisabled = false,
}) => {
  const isFiltered = region !== 'All' || population !== 'any' || sort !== 'name-asc';

  return (
    <div className="w-full p-4 sm:p-5 rounded-2xl glass-card border border-slate-800/80 light:border-slate-200 space-y-4">
      
      {/* Top Header & Reset Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-200 light:text-slate-800 font-semibold text-sm">
          <Filter className="w-4 h-4 text-blue-400 light:text-blue-600" />
          <span>Refine & Filter Dataset</span>
        </div>

        {isFiltered && (
          <button
            onClick={onReset}
            disabled={isDisabled}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-400 light:text-rose-600 border border-rose-500/20 hover:bg-rose-500/20 transition-all duration-200 focus:outline-none"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Filter Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Region Selector Pills */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 light:text-slate-600">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>Region</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                disabled={isDisabled}
                type="button"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                  region === r
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                    : 'bg-slate-800/50 light:bg-slate-100 text-slate-300 light:text-slate-700 border-slate-700/60 light:border-slate-300 hover:bg-slate-700/60 light:hover:bg-slate-200'
                } disabled:opacity-50`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Population Bracket */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 light:text-slate-600">
            <Users className="w-3.5 h-3.5 text-teal-400" />
            <span>Population Bracket</span>
          </label>
          <select
            value={population}
            onChange={(e) => setPopulation(e.target.value as PopulationFilter)}
            disabled={isDisabled}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-700/60 light:border-slate-300 bg-slate-900/60 light:bg-white text-slate-2 font-medium text-xs sm:text-sm text-slate-200 light:text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {POPULATION_RANGES.map((pop) => (
              <option key={pop.value} value={pop.value} className="bg-slate-900 light:bg-white text-slate-200 light:text-slate-800">
                {pop.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting Dropdown */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 light:text-slate-600">
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
            <span>Sort By</span>
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            disabled={isDisabled}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-700/60 light:border-slate-300 bg-slate-900/60 light:bg-white font-medium text-xs sm:text-sm text-slate-200 light:text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-slate-900 light:bg-white text-slate-200 light:text-slate-800">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
};
