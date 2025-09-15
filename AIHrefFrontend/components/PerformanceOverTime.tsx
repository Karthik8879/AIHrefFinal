"use client";

import { EnhancedAnalytics } from "@/lib/analytics";
import SectionHeader from "./SectionHeader";
import MetricGrid from "./MetricGrid";
import MetricCard from "./MetricCard";
import VisitorIcon from "./icons/VisitorIcon";

interface PerformanceOverTimeProps {
  analytics: EnhancedAnalytics;
}

export default function PerformanceOverTime({ analytics }: PerformanceOverTimeProps) {
  return (
    <div className="mb-8">
      <SectionHeader
        title="Performance Over Time"
        subtitle="(Last 6 months)"
      />
      <MetricGrid>
        <MetricCard
          title="Avg. Visits / Day"
          value={analytics.avgVisitsPerDay.toFixed(2)}
          icon={<VisitorIcon />}
          iconBgColor="bg-purple-100 dark:bg-purple-900/30"
          iconColor="text-purple-600 dark:text-purple-400"
        />
        <MetricCard
          title="Avg. Visits / Week"
          value={analytics.avgVisitsPerWeek.toFixed(2)}
          icon={<VisitorIcon />}
          iconBgColor="bg-indigo-100 dark:bg-indigo-900/30"
          iconColor="text-indigo-600 dark:text-indigo-400"
        />
        <MetricCard
          title="Avg. Repeat Visitors / Day"
          value={analytics.avgRepeatVisitorsPerDay.toFixed(2)}
          icon={<VisitorIcon />}
          iconBgColor="bg-teal-100 dark:bg-teal-900/30"
          iconColor="text-teal-600 dark:text-teal-400"
        />
      </MetricGrid>
    </div>
  );
}
