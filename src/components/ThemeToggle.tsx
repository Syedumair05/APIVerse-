import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="relative p-2.5 rounded-xl border border-slate-700/50 dark:border-slate-800 light:border-slate-200 bg-slate-800/40 dark:bg-slate-800/60 light:bg-slate-100 hover:bg-slate-700/60 dark:hover:bg-slate-700 light:hover:bg-slate-200 text-slate-300 dark:text-slate-200 light:text-slate-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-amber-400 animate-in spin-in-90 duration-300" />
      ) : (
        <Moon className="w-5 h-5 text-indigo-600 animate-in spin-in-90 duration-300" />
      )}
    </button>
  );
};
