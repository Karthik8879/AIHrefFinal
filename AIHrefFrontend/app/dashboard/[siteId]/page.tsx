"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  fetchEnhancedAnalytics,
  triggerManualAggregation,
  EnhancedAnalytics,
} from "@/lib/analytics";
import AIHrefLoader from "@/components/AIHrefLoader";
import LoadingOverlay from "@/components/LoadingOverlay";
import ErrorMessage from "@/components/ErrorMessage";
import ThemeToggle from "@/components/ThemeToggle";
import TrafficSummary from "@/components/TrafficSummary";
import HighestPerformingSegments from "@/components/HighestPerformingSegments";
import PerformanceOverTime from "@/components/PerformanceOverTime";
import TopLocationsList from "@/components/TopLocationsList";
import VisitorTrendsChart from "@/components/VisitorTrendsChart";
import CountriesBarChart from "@/components/CountriesBarChart";
import SourcesBarChart from "@/components/SourcesBarChart";

export default function DashboardPage() {
  const params = useParams();
  const siteId = params.siteId as string;

  const [analytics, setAnalytics] = useState<EnhancedAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<"7d" | "1m" | "1y" | "5y">(
    "7d"
  );
  const [isAggregating, setIsAggregating] = useState(false);
  const [aggregationMessage, setAggregationMessage] = useState<string | null>(
    null
  );

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(
        "Loading analytics for siteId:",
        siteId,
        "range:",
        selectedRange
      );

      // Fetch enhanced analytics
      const analyticsData = await fetchEnhancedAnalytics(siteId, selectedRange);

      console.log("Analytics data:", analyticsData);

      setAnalytics(analyticsData);
    } catch (err) {
      console.error("Error loading analytics:", err);
      setError(err instanceof Error ? err.message : "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, [siteId, selectedRange]);

  useEffect(() => {
    if (siteId) {
      loadAnalytics();
    }
  }, [siteId, loadAnalytics]);

  const handleManualAggregation = async () => {
    try {
      setIsAggregating(true);
      setAggregationMessage(null);
      setError(null);
      const result = await triggerManualAggregation();
      setAggregationMessage(result.message);
      if (result.status === "success") {
        await loadAnalytics(); // Refresh data after aggregation
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to trigger aggregation"
      );
    } finally {
      setIsAggregating(false);
    }
  };

  if (loading) {
    return <AIHrefLoader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <ErrorMessage message="No analytics data available" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="w-full p-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Portfolio Analytics Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Site:{" "}
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {siteId}
                </span>
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Time Range Selector */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Time Range:
                  </span>
                  <div className="flex space-x-1">
                    {(["7d", "1m", "1y", "5y"] as const).map((range) => (
                      <button
                        key={range}
                        onClick={() => setSelectedRange(range)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${selectedRange === range
                          ? "bg-blue-600 text-white shadow-lg transform scale-105"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:border-blue-300"
                          }`}
                      >
                        {range === "7d"
                          ? "7D"
                          : range === "1m"
                            ? "1M"
                            : range === "1y"
                              ? "1Y"
                              : "5Y"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Manual Aggregation Button */}
              <button
                onClick={handleManualAggregation}
                disabled={isAggregating}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isAggregating
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transform hover:scale-105"
                  }`}
              >
                {isAggregating ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Processing...
                  </>
                ) : (
                  "🔄 Run Aggregation"
                )}
              </button>
            </div>
          </div>

          {aggregationMessage && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="text-sm text-green-700 dark:text-green-300 font-medium">
                ✅ {aggregationMessage}
              </div>
            </div>
          )}
        </div>

        <TrafficSummary analytics={analytics} />

        {/* Highest Performing Segments */}
        <HighestPerformingSegments analytics={analytics} />

        {/* Performance Over Time */}
        <PerformanceOverTime analytics={analytics} />

        {/* Visualization Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Visualization
          </h2>
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Top 5 Locations - 25% width */}
            <div className="xl:col-span-1">
              <TopLocationsList analytics={analytics} />
            </div>

            {/* Visitor Trends - 75% width */}
            <div className="xl:col-span-3">
              <VisitorTrendsChart
                analytics={analytics}
                siteId={siteId}
                selectedRange={
                  selectedRange === "7d"
                    ? "7D"
                    : selectedRange === "1m"
                      ? "1M"
                      : selectedRange === "1y"
                        ? "1Y"
                        : "5Y"
                }
                onRangeChange={(range) => {
                  // Convert chart range to dashboard range
                  const dashboardRange =
                    range === "7D"
                      ? "7d"
                      : range === "1M"
                        ? "1m"
                        : range === "1Y"
                          ? "1y"
                          : "5y";
                  // Only update if different to prevent unnecessary reloads
                  if (selectedRange !== dashboardRange) {
                    setSelectedRange(
                      dashboardRange as "7d" | "1m" | "1y" | "5y"
                    );
                  }
                }}
              />
            </div>

            {/* Countries Bar Chart - 50% width */}
            <div className="xl:col-span-2">
              <CountriesBarChart analytics={analytics} />
            </div>

            {/* Sources Bar Chart - 50% width */}
            <div className="xl:col-span-2">
              <SourcesBarChart analytics={analytics} />
            </div>
          </div>
        </div>

      </div>

      {/* Loading Overlay for Aggregation */}
      <LoadingOverlay
        isVisible={isAggregating}
      />
    </div>
  );
}
