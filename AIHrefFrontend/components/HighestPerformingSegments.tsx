"use client";

import { EnhancedAnalytics } from "@/lib/analytics";
import SectionHeader from "./SectionHeader";
import MetricGrid from "./MetricGrid";
import MetricCard from "./MetricCard";
import StarIcon from "./icons/StarIcon";
import GlobeIcon from "./icons/GlobeIcon";
import LinkIcon from "./icons/LinkIcon";

interface HighestPerformingSegmentsProps {
  analytics: EnhancedAnalytics;
}

export default function HighestPerformingSegments({ analytics }: HighestPerformingSegmentsProps) {
  return (
    <div className="mb-8">
      <SectionHeader title="Highest Performing Segments" />
      <MetricGrid>
        <MetricCard
          title="Peak Visit Day"
          value={analytics.peakVisitDay}
          subtitle={`(${analytics.peakVisitCount} visits)`}
          icon={<StarIcon />}
          iconBgColor="bg-yellow-100 dark:bg-yellow-900/30"
          iconColor="text-yellow-600 dark:text-yellow-400"
        />
        <MetricCard
          title="Top Country"
          value={analytics.topCountry}
          icon={<GlobeIcon />}
          iconBgColor="bg-blue-100 dark:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <MetricCard
          title="Top Source"
          value={analytics.topSource}
          icon={<LinkIcon />}
          iconBgColor="bg-green-100 dark:bg-green-900/30"
          iconColor="text-green-600 dark:text-green-400"
        />
      </MetricGrid>
    </div>
  );
}
