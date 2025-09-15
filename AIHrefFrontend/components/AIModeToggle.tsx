"use client";

import { useState } from "react";

interface AIModeToggleProps {
  isAIMode: boolean;
  onToggle: (enabled: boolean) => void;
  isLoading?: boolean;
}

export default function AIModeToggle({ isAIMode, onToggle, isLoading = false }: AIModeToggleProps) {
  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        AI Mode
      </span>
      <button
        onClick={() => onToggle(!isAIMode)}
        disabled={isLoading}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isAIMode
            ? "bg-blue-600"
            : "bg-gray-200 dark:bg-gray-700"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${isAIMode ? "translate-x-6" : "translate-x-1"
            }`}
        />
      </button>
      {isAIMode && (
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
            AI Active
          </span>
        </div>
      )}
    </div>
  );
}
