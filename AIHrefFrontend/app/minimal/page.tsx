"use client";

export default function MinimalPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Minimal Test Page
        </h1>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Basic Test
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            If you can see this text, React is working properly.
          </p>
        </div>

        <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Chart Placeholder
          </h2>
          <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-gray-600 dark:text-gray-300 text-center">
              <div className="text-4xl mb-2">📊</div>
              <div>Chart would go here</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
