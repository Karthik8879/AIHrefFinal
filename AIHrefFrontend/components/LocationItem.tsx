"use client";

interface LocationItemProps {
  city: string;
  country: string;
  count: number;
  rank: number;
}

export default function LocationItem({ city, country, count, rank }: LocationItemProps) {
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            {rank}
          </span>
        </div>
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {city}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {country}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-semibold text-gray-900 dark:text-white">
          {count.toLocaleString()}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          visits
        </div>
      </div>
    </div>
  );
}
