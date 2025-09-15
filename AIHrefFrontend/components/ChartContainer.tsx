"use client";

import { ReactNode } from "react";

interface ChartContainerProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function ChartContainer({ title, children, className = "" }: ChartContainerProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 h-[520px] flex flex-col ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <div className="w-full flex-1" style={{ height: "400px" }}>
        {children}
      </div>
    </div>
  );
}
