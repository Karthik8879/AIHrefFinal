"use client";

import { ReactNode } from "react";

interface MetricGridProps {
  children: ReactNode;
  className?: string;
}

export default function MetricGrid({ children, className = "" }: MetricGridProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ${className}`}>
      {children}
    </div>
  );
}
