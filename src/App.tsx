import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Favorites } from './pages/Favorites';
import { Analytics } from './pages/Analytics';
import { About } from './pages/About';
import { clearCountriesCache } from './api/countriesApi';

export const AppContent: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshApi = async () => {
    setIsRefreshing(true);
    clearCountriesCache();
    // Refresh page or trigger re-fetch by dispatching a custom event or reloading
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-950 light:bg-slate-50 text-slate-100 light:text-slate-900 flex flex-col font-sans transition-colors duration-300">
      <Navbar onRefreshApi={handleRefreshApi} isRefreshing={isRefreshing} />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>

      {/* Modern Footer */}
      <footer className="w-full border-t border-slate-800/80 light:border-slate-200 py-6 text-center text-xs text-slate-400 light:text-slate-600 glass-panel">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200 light:text-slate-800">APIVerse</span>
            <span>&bull; Advanced REST API Explorer</span>
          </div>
          <p>© {new Date().getFullYear()} APIVerse. Powered by REST Countries API v3.1</p>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <Router>
          <AppContent />
        </Router>
      </FavoritesProvider>
    </ThemeProvider>
  );
};

export default App;
