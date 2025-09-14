"use client";

import { EnhancedAnalytics } from "@/lib/analytics";

interface TopLocationsListProps {
  analytics: EnhancedAnalytics;
}

export default function TopLocationsList({ analytics }: TopLocationsListProps) {
  // Get top 5 locations from the analytics data
  const topLocations = analytics.topLocations.slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 h-[520px] flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Top 5 Locations
      </h3>
      <div className="space-y-3 flex-1">
        {topLocations.map((location, index) => (
          <div
            key={`${location.city}-${location.country}`}
            className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {index + 1}
                </span>
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {location.city}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {location.country}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900 dark:text-white">
                {location.count.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                visits
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
