"use client";

import ThemeToggle from "./ThemeToggle";
import BackButton from "./BackButton";

interface DashboardHeaderProps {
  siteId: string;
  selectedRange: "7d" | "1m" | "1y" | "5y";
  onRangeChange: (range: "7d" | "1m" | "1y" | "5y") => void;
  onManualAggregation: () => void;
  isAggregating: boolean;
  aggregationMessage?: string | null;
}

export default function DashboardHeader({
  siteId,
  selectedRange,
  onRangeChange,
  onManualAggregation,
  isAggregating,
  aggregationMessage,
}: DashboardHeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 py-4">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
            {/* Left Section - Back Button, Analytics Icon, Title and Site Info */}
            <div className="flex items-center space-x-4">
              <BackButton />
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                    {siteId.charAt(0).toUpperCase() + siteId.slice(1)} Analytics
                  </h1>
                  <div className="flex items-center space-x-1 px-2 py-1 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-green-700 dark:text-green-300">Live</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Website:</span>
                  <a
                    href={`https://${siteId}.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span>Visit {siteId}.com</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Section - Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              {/* Time Range Selector */}
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  Time Range:
                </span>
                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                  {(["7d", "1m", "1y", "5y"] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => onRangeChange(range)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${selectedRange === range
                        ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        }`}
                    >
                      {range === "7d" ? "7D" : range === "1m" ? "1M" : range === "1y" ? "1Y" : "5Y"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Manual Aggregation Button */}
              <button
                onClick={onManualAggregation}
                disabled={isAggregating}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${isAggregating
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md transform hover:scale-105"
                  }`}
              >
                {isAggregating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Run Aggregation</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Aggregation Message */}
          {aggregationMessage && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-sm text-green-700 dark:text-green-300 font-medium">
                  {aggregationMessage}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
