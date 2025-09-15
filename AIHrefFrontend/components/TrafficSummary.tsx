"use client";

import { EnhancedAnalytics } from "@/lib/analytics";
import SectionHeader from "./SectionHeader";
import MetricCard from "./MetricCard";
import VisitorIcon from "./icons/VisitorIcon";
import ClockIcon from "./icons/ClockIcon";
import CalendarIcon from "./icons/CalendarIcon";

interface TrafficSummaryProps {
  analytics: EnhancedAnalytics;
}

export default function TrafficSummary({ analytics }: TrafficSummaryProps) {
  return (
    <div className="mb-8">
      <SectionHeader title="Traffic Summary" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Total Visitors till date"
          value={analytics.totalVisitorsTillDate}
          icon={<VisitorIcon />}
          iconBgColor="bg-blue-100 dark:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <MetricCard
          title="Today's Visitors"
          value={analytics.todayVisitors}
          icon={<ClockIcon />}
          iconBgColor="bg-green-100 dark:bg-green-900/30"
          iconColor="text-green-600 dark:text-green-400"
        />
        <MetricCard
          title="This Week"
          value={analytics.thisWeekVisitors}
          icon={<CalendarIcon />}
          iconBgColor="bg-purple-100 dark:bg-purple-900/30"
          iconColor="text-purple-600 dark:text-purple-400"
        />
        <MetricCard
          title="This Month"
          value={analytics.thisMonthVisitors}
          icon={<CalendarIcon />}
          iconBgColor="bg-orange-100 dark:bg-orange-900/30"
          iconColor="text-orange-600 dark:text-orange-400"
        />
        <MetricCard
          title="Repeat Visitors Today"
          value={analytics.repeatVisitorsToday}
          icon={<VisitorIcon />}
          iconBgColor="bg-teal-100 dark:bg-teal-900/30"
          iconColor="text-teal-600 dark:text-teal-400"
        />
      </div>
    </div>
  );
}
