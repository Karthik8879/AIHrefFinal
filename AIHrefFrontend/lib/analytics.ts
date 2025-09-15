export interface PageCount {
  url: string;
  count: number;
}

export interface CountryCount {
  country: string;
  count: number;
}


export interface EnhancedAnalytics {
  siteId: string;
  range: string;

  // Traffic Summary
  totalVisitorsTillDate: number;
  todayVisitors: number;
  thisWeekVisitors: number;
  thisMonthVisitors: number;
  repeatVisitorsToday: number;

  // Highest Performing Segments
  peakVisitDay: string;
  peakVisitCount: number;
  topCountry: string;
  topSource: string;

  // Performance Over Time
  avgVisitsPerDay: number;
  avgVisitsPerWeek: number;
  avgRepeatVisitorsPerDay: number;

  // Detailed Data
  topPages: PageCount[];
  topCountries: CountryCount[];
  topSources: SourceCount[];
  topLocations: LocationCount[];
  dailyVisitorTrends: DailyVisitorCount[];

  lastUpdated: string;
}

export interface SourceCount {
  source: string;
  count: number;
}

export interface LocationCount {
  city: string;
  country: string;
  count: number;
}

export interface DailyVisitorCount {
  date: string;
  visitors: number;
  pageviews: number;
}


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";


export async function fetchEnhancedAnalytics(
  siteId: string,
  range: "7d" | "1m" | "30d" | "1y" | "5y" | "all" = "7d"
): Promise<EnhancedAnalytics> {
  const url = `${API_BASE_URL}/api/analytics/enhanced?siteId=${encodeURIComponent(
    siteId
  )}&range=${range}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch enhanced analytics: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

export async function triggerManualAggregation(): Promise<{
  status: string;
  message: string;
}> {
  const url = `${API_BASE_URL}/api/admin/trigger-aggregation`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to trigger aggregation: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}



// New API function to fetch visitor trends for charts
export async function fetchVisitorTrends(
  siteId: string,
  range: "7d" | "1m" | "1y" | "5y" = "7d"
): Promise<DailyVisitorCount[]> {
  const url = `${API_BASE_URL}/api/analytics/visitor-trends?siteId=${encodeURIComponent(
    siteId
  )}&range=${range}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch visitor trends: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}
