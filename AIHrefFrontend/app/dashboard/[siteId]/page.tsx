"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  fetchEnhancedAnalytics,
  triggerManualAggregation,
  EnhancedAnalytics,
} from "@/lib/analytics";
import { fetchAIInsights, fetchQuickInsights, AIInsightsResponse } from "@/lib/ai-insights";
import AIHrefLoader from "@/components/AIHrefLoader";
import LoadingOverlay from "@/components/LoadingOverlay";
import ErrorMessage from "@/components/ErrorMessage";
import DashboardHeader from "@/components/DashboardHeader";
import AIInsightsPanel from "@/components/AIInsightsPanel";
import AIModeToggle from "@/components/AIModeToggle";
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
  const [isAIMode, setIsAIMode] = useState(false);
  const [aiInsights, setAiInsights] = useState<AIInsightsResponse | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

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

  useEffect(() => {
    if (isAIMode && analytics) {
      loadQuickAIInsights();
    }
  }, [isAIMode, selectedRange, siteId]);

  const loadQuickAIInsights = async () => {
    try {
      setAiLoading(true);
      const insights = await fetchQuickInsights(siteId, selectedRange);
      setAiInsights(insights);
    } catch (err) {
      console.error("Error loading AI insights:", err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAIQuestion = async (question: string) => {
    try {
      setAiLoading(true);
      const insights = await fetchAIInsights({
        siteId: siteId,
        range: selectedRange,
        query: question,
        includeTrends: true,
        includePredictions: true,
      });
      setAiInsights(insights);
    } catch (err) {
      console.error("Error processing AI question:", err);
    } finally {
      setAiLoading(false);
    }
  };

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

      {/* AI Mode Toggle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-end">
          <AIModeToggle
            isAIMode={isAIMode}
            onToggle={setIsAIMode}
            isLoading={aiLoading}
          />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* AI Mode Content */}
        {isAIMode ? (
          <div className="space-y-8">
            {/* AI Insights Panel */}
            <AIInsightsPanel
              insights={aiInsights}
              isLoading={aiLoading}
              onAskQuestion={handleAIQuestion}
            />

            {/* Analytics Data Summary (Collapsed in AI Mode) */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                📊 Analytics Data Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {(analytics.totalVisitors || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Visitors</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {(analytics.totalPageViews || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Page Views</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {Math.round(analytics.averageSessionDuration || 0)}s
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Avg Session</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {(analytics.bounceRate || 0).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Bounce Rate</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Regular Analytics View */
          <>
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
          </>
        )}
      </div>

      {/* Loading Overlay for Aggregation */}
      <LoadingOverlay
        isVisible={isAggregating}
      />
    </div>
  );
}
