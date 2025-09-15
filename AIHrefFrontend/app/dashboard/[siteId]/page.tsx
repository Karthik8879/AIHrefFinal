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
import DashboardHeader from "@/components/DashboardHeader";
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
      <DashboardHeader
        siteId={siteId}
        selectedRange={selectedRange}
        onRangeChange={setSelectedRange}
        onManualAggregation={handleManualAggregation}
        isAggregating={isAggregating}
        aggregationMessage={aggregationMessage}
      />
      <div className="w-full p-4">

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
