"use client";

import { EnhancedAnalytics } from "@/lib/analytics";
import ChartContainer from "./ChartContainer";
import LocationItem from "./LocationItem";

interface TopLocationsListProps {
  analytics: EnhancedAnalytics;
}

export default function TopLocationsList({ analytics }: TopLocationsListProps) {
  // Get top 5 locations from the analytics data
  const topLocations = analytics.topLocations.slice(0, 5);

  return (
    <ChartContainer title="Top 5 Locations">
      <div className="space-y-3 h-full overflow-y-auto">
        {topLocations.map((location, index) => (
          <LocationItem
            key={`${location.city}-${location.country}`}
            city={location.city}
            country={location.country}
            count={location.count}
            rank={index + 1}
          />
        ))}
      </div>
    </ChartContainer>
  );
}
