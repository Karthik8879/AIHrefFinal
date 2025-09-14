'use client';

import { useTheme } from '@/lib/theme-context';

export default function ThemeDebug() {
  const { theme } = useTheme();

  return (
    <div className="fixed top-4 right-4 z-50 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
      <div className="text-sm">
        <div className="font-semibold text-gray-900 dark:text-gray-100">Theme Debug</div>
        <div className="text-gray-600 dark:text-gray-300">Current theme: {theme}</div>
        <div className="text-gray-600 dark:text-gray-300">Document class: {typeof document !== 'undefined' ? document.documentElement.className : 'N/A'}</div>
      </div>
    </div>
  );
}
