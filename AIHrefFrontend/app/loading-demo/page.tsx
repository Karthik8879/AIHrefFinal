"use client";

import { useState } from "react";
import AIHrefLoader from "@/components/AIHrefLoader";
import LoadingOverlay from "@/components/LoadingOverlay";
import SkeletonLoader from "@/components/SkeletonLoader";

export default function LoadingDemo() {
  const [showMainLoader, setShowMainLoader] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 text-center">
          AIHref Loading Components Demo
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Main Loader Demo */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Main Loader
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Full-screen loading component with AIHref branding
            </p>
            <button
              onClick={() => {
                setShowMainLoader(true);
                setTimeout(() => setShowMainLoader(false), 3000);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Show Main Loader (3s)
            </button>
          </div>

          {/* Overlay Loader Demo */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Overlay Loader
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Modal overlay for background operations
            </p>
            <button
              onClick={() => {
                setShowOverlay(true);
                setTimeout(() => setShowOverlay(false), 3000);
              }}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Show Overlay (3s)
            </button>
          </div>
        </div>

        {/* Skeleton Loaders Demo */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Skeleton Loaders
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SkeletonLoader type="metric" />
            <SkeletonLoader type="metric" />
            <SkeletonLoader type="metric" />
            <SkeletonLoader type="metric" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <SkeletonLoader type="chart" />
            <SkeletonLoader type="list" />
          </div>
        </div>

        {/* Features */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            ✨ Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
            <ul className="space-y-2">
              <li>• 🎨 Custom AIHref branding</li>
              <li>• 🌙 Dark/Light theme support</li>
              <li>• ⚡ Smooth animations</li>
              <li>• 📱 Responsive design</li>
            </ul>
            <ul className="space-y-2">
              <li>• 🎯 Multiple loading states</li>
              <li>• 💫 Floating particles</li>
              <li>• 🔄 Progress indicators</li>
              <li>• 🎪 Interactive demos</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Loaders */}
      {showMainLoader && <AIHrefLoader />}
      <LoadingOverlay
        isVisible={showOverlay}
      />
    </div>
  );
}
