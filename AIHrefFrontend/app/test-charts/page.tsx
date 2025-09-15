"use client";

import { useState, useEffect } from "react";
import { fetchCombinedAnalytics } from "@/lib/combined-analytics";
import CombinedVisitorTrendsChart from "@/components/CombinedVisitorTrendsChart";

export default function TestChartsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Loading test data...");
        const data = await fetchCombinedAnalytics("7d");
        console.log("Test data loaded:", data);
        setAnalytics(data);
      } catch (err) {
        console.error("Error loading test data:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading test data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">❌ Error</div>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Chart Test Page
        </h1>

        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Raw Data Debug
          </h2>
          <pre className="text-sm text-gray-600 dark:text-gray-300 overflow-auto">
            {JSON.stringify(analytics, null, 2)}
          </pre>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Chart Test
          </h2>
          <CombinedVisitorTrendsChart analytics={analytics} selectedRange="7d" />
        </div>
      </div>
    </div>
  );
}
