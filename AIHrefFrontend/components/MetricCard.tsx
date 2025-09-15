"use client";

import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  iconBgColor: string;
  iconColor: string;
  className?: string;
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  iconBgColor,
  iconColor,
  className = "",
}: MetricCardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
            {title}
          </div>
          {subtitle && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </div>
          )}
        </div>
        <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
          <div className={`w-6 h-6 ${iconColor}`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}
