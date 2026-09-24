import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCountries } from '../api/countriesApi';
import { getOverviewAnalytics } from '../api/analyticsApi';
import type { Country, PopulationFilter, RegionFilter, SortOption } from '../types/country';
import type { Analytics } from '../types/analytics';
import { filterCountries, sortCountries } from '../utils/countryUtils';
import { useDebounce } from './useDebounce';

const ITEMS_PER_PAGE = 12;

export function useCountries() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Complete Raw Dataset State & Analytics State
  const [countries, setCountries] = useState<Country[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState<boolean>(false);

  // Extract initial values from URL search params
  const initialSearch = searchParams.get('search') || '';
  const initialRegion = (searchParams.get('region') as RegionFilter) || 'All';
  const initialPopulation = (searchParams.get('population') as PopulationFilter) || 'any';
  const initialSort = (searchParams.get('sort') as SortOption) || 'name-asc';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  // Input states
  const [searchInput, setSearchInput] = useState<string>(initialSearch);
  const [region, setRegion] = useState<RegionFilter>(initialRegion);
  const [population, setPopulation] = useState<PopulationFilter>(initialPopulation);
  const [sort, setSort] = useState<SortOption>(initialSort);
  const [currentPage, setCurrentPage] = useState<number>(isNaN(initialPage) ? 1 : initialPage);

  // Debounced search query
  const debouncedSearch = useDebounce(searchInput, 300);

  // Fetch COMPLETE API dataset and Global Analytics
  const fetchData = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Fetch complete 250+ country dataset
      const { data, fromCache } = await getCountries(forceRefresh);
      console.log(`Fetched ${data.length} countries from REST Countries API`);
      setCountries(data);
      setIsFromCache(fromCache);

      // 2. Fetch global analytics over the complete dataset
      const overviewStats = await getOverviewAnalytics();
      setAnalytics(overviewStats);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch country data.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(false);
  }, [fetchData]);

  // Sync state changes to URL query parameters
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (region !== 'All') params.set('region', region);
    if (population !== 'any') params.set('population', population);
    if (sort !== 'name-asc') params.set('sort', sort);
    if (currentPage > 1) params.set('page', currentPage.toString());

    setSearchParams(params, { replace: true });
  }, [debouncedSearch, region, population, sort, currentPage, setSearchParams]);

  // Reset page to 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, region, population, sort]);

  // Calculate filtered and sorted dataset ONLY for grid cards
  const filteredCountries = useMemo(() => {
    const filtered = filterCountries(countries, debouncedSearch, region, population);
    return sortCountries(filtered, sort);
  }, [countries, debouncedSearch, region, population, sort]);

  // Pagination math (12 items per page)
  const totalPages = Math.ceil(filteredCountries.length / ITEMS_PER_PAGE) || 1;
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedCountries = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredCountries.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCountries, safeCurrentPage]);

  // Handler functions
  const resetFilters = useCallback(() => {
    setSearchInput('');
    setRegion('All');
    setPopulation('any');
    setSort('name-asc');
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 350, behavior: 'smooth' });
  }, []);

  return {
    allCountries: countries,
    analytics,
    filteredCountries,
    paginatedCountries,
    isLoading,
    error,
    isFromCache,
    searchInput,
    setSearchInput,
    region,
    setRegion,
    population,
    setPopulation,
    sort,
    setSort,
    currentPage: safeCurrentPage,
    totalPages,
    totalCount: filteredCountries.length,
    rawTotalCount: countries.length,
    itemsPerPage: ITEMS_PER_PAGE,
    fetchData,
    resetFilters,
    handlePageChange,
  };
}
