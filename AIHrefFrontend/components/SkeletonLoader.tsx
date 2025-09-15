"use client";

interface SkeletonLoaderProps {
  type?: 'card' | 'chart' | 'list' | 'metric';
  className?: string;
}

export default function SkeletonLoader({ type = 'card', className = '' }: SkeletonLoaderProps) {
  const baseClasses = "animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg";

  switch (type) {
    case 'metric':
      return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className={`${baseClasses} h-8 w-24 mb-2`}></div>
              <div className={`${baseClasses} h-4 w-16`}></div>
            </div>
            <div className={`${baseClasses} w-12 h-12 rounded-lg`}></div>
          </div>
        </div>
      );

    case 'chart':
      return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 h-[520px] flex flex-col ${className}`}>
          <div className={`${baseClasses} h-6 w-48 mb-4`}></div>
          <div className="flex-1 space-y-3">
            <div className={`${baseClasses} h-4 w-full`}></div>
            <div className={`${baseClasses} h-4 w-5/6`}></div>
            <div className={`${baseClasses} h-4 w-4/5`}></div>
            <div className={`${baseClasses} h-4 w-3/4`}></div>
            <div className={`${baseClasses} h-4 w-2/3`}></div>
          </div>
        </div>
      );

    case 'list':
      return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 h-[520px] flex flex-col ${className}`}>
          <div className={`${baseClasses} h-6 w-32 mb-4`}></div>
          <div className="space-y-3 flex-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center space-x-3">
                  <div className={`${baseClasses} w-8 h-8 rounded-full`}></div>
                  <div>
                    <div className={`${baseClasses} h-4 w-20 mb-1`}></div>
                    <div className={`${baseClasses} h-3 w-16`}></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`${baseClasses} h-4 w-12 mb-1`}></div>
                  <div className={`${baseClasses} h-3 w-8`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    default: // card
      return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
          <div className={`${baseClasses} h-6 w-3/4 mb-4`}></div>
          <div className="space-y-3">
            <div className={`${baseClasses} h-4 w-full`}></div>
            <div className={`${baseClasses} h-4 w-5/6`}></div>
            <div className={`${baseClasses} h-4 w-4/5`}></div>
          </div>
        </div>
      );
  }
}
