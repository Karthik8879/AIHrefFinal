'use client';

import { useTheme } from '@/lib/theme-context';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
      aria-label="Toggle theme"
    >
      <Sun
        className={`h-5 w-5 text-yellow-500 transition-all duration-300 ${theme === 'light' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-75'
          }`}
      />
      <Moon
        className={`absolute h-5 w-5 text-blue-400 transition-all duration-300 ${theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
          }`}
      />
    </button>
  );
}
