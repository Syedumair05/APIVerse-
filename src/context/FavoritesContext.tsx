import React, { createContext, useContext, useEffect, useState } from 'react';

interface FavoritesContextType {
  favorites: string[]; // List of country cca3 codes
  isFavorite: (cca3: string) => boolean;
  toggleFavorite: (cca3: string) => void;
  clearFavorites: () => void;
  favoriteCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'apiverse_favorites';

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback to empty array
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Ignore errors
    }
  }, [favorites]);

  const isFavorite = (cca3: string): boolean => {
    return favorites.includes(cca3);
  };

  const toggleFavorite = (cca3: string): void => {
    setFavorites((prev) => {
      if (prev.includes(cca3)) {
        return prev.filter((code) => code !== cca3);
      } else {
        return [...prev, cca3];
      }
    });
  };

  const clearFavorites = (): void => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        clearFavorites,
        favoriteCount: favorites.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
