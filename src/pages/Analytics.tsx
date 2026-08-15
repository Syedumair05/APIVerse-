import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from 'recharts';
import { BarChart3, Users, Globe2, Maximize2, PieChart as PieIcon } from 'lucide-react';
import { useCountries } from '../hooks/useCountries';
import {
  getRegionPopulationData,
  getTopAreaCountries,
  getTopPopulatedCountries,
} from '../utils/statistics';
import { formatCompactNumber, formatNumber } from '../utils/countryUtils';
import { useTheme } from '../context/ThemeContext';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

const PIE_COLORS = ['#3B82F6', '#6366F1', '#14B8A6', '#F59E0B', '#EC4899', '#8B5CF6', '#10B981'];

export const Analytics: React.FC = () => {
  const { allCountries, isLoading } = useCountries();
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  // Compute aggregated live data
  const regionData = useMemo(() => getRegionPopulationData(allCountries), [allCountries]);
  const topPopulated = useMemo(() => getTopPopulatedCountries(allCountries, 10), [allCountries]);
  const topArea = useMemo(() => getTopAreaCountries(allCountries, 10), [allCountries]);

  const tooltipBg = isDark ? '#111827' : '#FFFFFF';
  const tooltipBorder = isDark ? '#374151' : '#E5E7EB';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const axisColor = isDark ? '#94A3B8' : '#64748B';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="h-20 rounded-2xl skeleton-shimmer" />
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-20">
      
      {/* Page Header */}
      <div className="flex items-center gap-4 border-b border-slate-800/80 light:border-slate-200 pb-6">
        <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20 shadow-lg shadow-teal-500/10">
          <BarChart3 className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 light:text-slate-900 tracking-tight">
            Global Analytics & Visual Insights
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600 mt-0.5">
            Real-time interactive distribution charts powered dynamically by live REST Countries payload ({allCountries.length} countries analyzed)
          </p>
        </div>
      </div>

      {/* Grid 1: Population by Region & Countries by Region */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Population by Region */}
        <div className="p-6 rounded-3xl glass-card border border-slate-800/80 light:border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              <h2 className="text-base font-bold text-slate-100 light:text-slate-900">
                Population Distribution by Region
              </h2>
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Total Inhabitants
            </span>
          </div>

          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="region" stroke={axisColor} fontSize={12} tickLine={false} />
                <YAxis
                  stroke={axisColor}
                  fontSize={12}
                  tickFormatter={(val) => formatCompactNumber(val)}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: tooltipBorder,
                    borderRadius: '16px',
                    color: textColor,
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
                  }}
                  formatter={(value: unknown) => [formatNumber(Number(value) || 0), 'Population']}
                />
                <Bar dataKey="population" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Countries Count by Region */}
        <div className="p-6 rounded-3xl glass-card border border-slate-800/80 light:border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-teal-400" />
              <h2 className="text-base font-bold text-slate-100 light:text-slate-900">
                Countries Breakdown by Region
              </h2>
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
              Share of Nations
            </span>
          </div>

          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={regionData}
                  dataKey="countryCount"
                  nameKey="region"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  label={({ name, value }: { name?: string | number; value?: string | number }) => `${name ?? ''}: ${value ?? 0}`}
                >
                  {regionData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: tooltipBorder,
                    borderRadius: '16px',
                    color: textColor,
                  }}
                  formatter={(value: unknown) => [`${value ?? 0} countries`, 'Count']}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Grid 2: Top 10 Populated & Top 10 Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 3: Top 10 Most Populous Countries */}
        <div className="p-6 rounded-3xl glass-card border border-slate-800/80 light:border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-bold text-slate-100 light:text-slate-900">
                Top 10 Most Populous Nations
              </h2>
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Demographics
            </span>
          </div>

          <div className="h-96 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={topPopulated}
                margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                <XAxis
                  type="number"
                  stroke={axisColor}
                  fontSize={11}
                  tickFormatter={(val) => formatCompactNumber(val)}
                />
                <YAxis dataKey="name" type="category" stroke={axisColor} fontSize={11} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: tooltipBorder,
                    borderRadius: '16px',
                    color: textColor,
                  }}
                  formatter={(value: unknown) => [formatNumber(Number(value) || 0), 'Population']}
                />
                <Bar dataKey="value" fill="#6366F1" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Top 10 Largest Countries by Area */}
        <div className="p-6 rounded-3xl glass-card border border-slate-800/80 light:border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Maximize2 className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-slate-100 light:text-slate-900">
                Top 10 Largest Nations by Surface Area
              </h2>
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Sq Kilometers
            </span>
          </div>

          <div className="h-96 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={topArea}
                margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                <XAxis
                  type="number"
                  stroke={axisColor}
                  fontSize={11}
                  tickFormatter={(val) => formatCompactNumber(val)}
                />
                <YAxis dataKey="name" type="category" stroke={axisColor} fontSize={11} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: tooltipBorder,
                    borderRadius: '16px',
                    color: textColor,
                  }}
                  formatter={(value: unknown) => [`${formatNumber(Number(value) || 0)} sq km`, 'Land Area']}
                />
                <Bar dataKey="value" fill="#F59E0B" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
