"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import CombinedAnalytics from "@/components/CombinedAnalytics";
import AIInsightsPanel from "@/components/AIInsightsPanel";
import AIModeToggle from "@/components/AIModeToggle";
import { fetchCombinedAnalytics, CombinedAnalytics as CombinedAnalyticsType } from "@/lib/combined-analytics";
import { fetchCombinedAIInsights, fetchCombinedQuickInsights, AIInsightsResponse } from "@/lib/ai-insights";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  const [analytics, setAnalytics] = useState<CombinedAnalyticsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<"7d" | "1m" | "1y" | "5y">("7d");
  const [isAIMode, setIsAIMode] = useState(false);
  const [aiInsights, setAiInsights] = useState<AIInsightsResponse | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCombinedAnalytics(selectedRange);
        setAnalytics(data);
      } catch (err) {
        console.error("Error loading analytics:", err);
        setError(err instanceof Error ? err.message : "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [selectedRange]);

  useEffect(() => {
    if (isAIMode && analytics) {
      loadQuickAIInsights();
    }
  }, [isAIMode, selectedRange]);

  const loadQuickAIInsights = async () => {
    try {
      setAiLoading(true);
      const insights = await fetchCombinedQuickInsights(selectedRange);
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
      const insights = await fetchCombinedAIInsights({
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Loading combined analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Analytics</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Combined Analytics Dashboard
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Real-time insights across all your websites
            </p>
          </div>

          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <AIModeToggle
              isAIMode={isAIMode}
              onToggle={setIsAIMode}
              isLoading={aiLoading}
            />
            <ThemeToggle />
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Range:</span>
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                {(["7d", "1m", "1y", "5y"] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedRange(range)}
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
          </div>
        </div>

        {/* AI Mode Content */}
        {isAIMode ? (
          <div className="space-y-8">
            {/* AI Insights Panel */}
            <AIInsightsPanel
              insights={aiInsights}
              isLoading={aiLoading}
              onAskQuestion={handleAIQuestion}
            />

            {/* Analytics Data (Collapsed in AI Mode) */}
            {analytics && (
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
            )}
          </div>
        ) : (
          /* Regular Analytics View */
          analytics && <CombinedAnalytics analytics={analytics} selectedRange={selectedRange} />
        )}
      </div>
    </div>
  );
}