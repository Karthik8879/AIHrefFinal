"use client";

import { useState, useEffect } from "react";

export default function DebugPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Debug page loaded");

    // Test if we can fetch data
    fetch("http://localhost:8080/api/analytics/combined?range=7d")
      .then(response => response.json())
      .then(data => {
        console.log("Fetched data:", data);
        setData(data);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setError(err.message);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Debug Page
        </h1>

        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Data Fetch Test
          </h2>
          {error ? (
            <div className="text-red-500">Error: {error}</div>
          ) : data ? (
            <div className="text-green-500">✅ Data fetched successfully!</div>
          ) : (
            <div className="text-yellow-500">⏳ Loading...</div>
          )}
        </div>

        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Raw Data
          </h2>
          <pre className="text-sm text-gray-600 dark:text-gray-300 overflow-auto max-h-96">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>

        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Chart.js Test
          </h2>
          <div className="text-center">
            <div className="w-64 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <div className="text-gray-600 dark:text-gray-300">
                Chart placeholder
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
