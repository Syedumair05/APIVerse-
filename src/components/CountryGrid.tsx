import React from 'react';
import type { Country } from '../types/country';
import { CountryCard } from './CountryCard';

interface CountryGridProps {
  countries: Country[];
  onSelectCountry: (country: Country) => void;
}

export const CountryGrid: React.FC<CountryGridProps> = ({ countries, onSelectCountry }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {countries.map((country) => (
        <CountryCard
          key={country.cca3}
          country={country}
          onSelect={onSelectCountry}
        />
      ))}
    </div>
  );
};
