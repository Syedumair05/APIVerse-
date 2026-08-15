import React, { useState } from 'react';
import { Hero } from '../components/Hero';
import { StatsCards } from '../components/StatsCards';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { CountryGrid } from '../components/CountryGrid';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { Pagination } from '../components/Pagination';
import { CountryDetailsModal } from '../components/CountryDetailsModal';
import { useCountries } from '../hooks/useCountries';
import type { Country } from '../types/country';

export const Home: React.FC = () => {
  const {
    allCountries,
    filteredCountries,
    paginatedCountries,
    isLoading,
    error,
    searchInput,
    setSearchInput,
    region,
    setRegion,
    population,
    setPopulation,
    sort,
    setSort,
    currentPage,
    totalPages,
    totalCount,
    rawTotalCount,
    itemsPerPage,
    dynamicStats,
    fetchData,
    resetFilters,
    handlePageChange,
  } = useCountries();

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Header */}
      <Hero />

      {/* Dynamic Statistics Cards */}
      <StatsCards stats={dynamicStats} isLoading={isLoading} />

      {/* Main Explorer Control Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Search Bar */}
        <SearchBar
          value={searchInput}
          onChange={setSearchInput}
          filteredCount={totalCount}
          totalCount={rawTotalCount}
          isDisabled={isLoading || !!error}
        />

        {/* Filter Panel */}
        <FilterPanel
          region={region}
          setRegion={setRegion}
          population={population}
          setPopulation={setPopulation}
          sort={sort}
          setSort={setSort}
          onReset={resetFilters}
          isDisabled={isLoading || !!error}
        />

        {/* Dynamic State Rendering (Loading / Error / Empty / Grid) */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={() => fetchData(true)} />
        ) : filteredCountries.length === 0 ? (
          <EmptyState onReset={resetFilters} />
        ) : (
          <>
            <CountryGrid
              countries={paginatedCountries}
              onSelectCountry={(c) => setSelectedCountry(c)}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={totalCount}
              itemsPerPage={itemsPerPage}
            />
          </>
        )}
      </main>

      {/* Details Modal */}
      <CountryDetailsModal
        country={selectedCountry}
        allCountries={allCountries}
        onClose={() => setSelectedCountry(null)}
      />
    </div>
  );
};
