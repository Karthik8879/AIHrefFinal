export interface PageCount {
  url: string;
  count: number;
}

export interface CountryCount {
  country: string;
  count: number;
}

export interface AnalyticsSummary {
  siteId: string;
  range: string;
  visitors: number;
  pageviews: number;
  topPages: PageCount[];
  topCountries: CountryCount[];
  lastUpdated: string;
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
  state: string;
  country: string;
  count: number;
}

export interface DailyVisitorCount {
  date: string;
  visitors: number;
  pageviews: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function fetchAnalyticsSummary(
  siteId: string,
  range: '7d' | '30d' | 'all' = '7d'
): Promise<AnalyticsSummary> {
  const url = `${API_BASE_URL}/api/analytics/summary?siteId=${encodeURIComponent(siteId)}&range=${range}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch analytics: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function fetchRealTimeAnalytics(
  siteId: string,
  range: '7d' | '1m' | '30d' | '1y' | '5y' | 'all' = '7d'
): Promise<AnalyticsSummary> {
  const url = `${API_BASE_URL}/api/analytics/realtime?siteId=${encodeURIComponent(siteId)}&range=${range}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch real-time analytics: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function fetchEnhancedAnalytics(
  siteId: string,
  range: '7d' | '1m' | '30d' | '1y' | '5y' | 'all' = '7d'
): Promise<EnhancedAnalytics> {
  const url = `${API_BASE_URL}/api/analytics/enhanced?siteId=${encodeURIComponent(siteId)}&range=${range}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch enhanced analytics: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function triggerManualAggregation(): Promise<{ status: string, message: string }> {
  const url = `${API_BASE_URL}/api/admin/trigger-aggregation`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to trigger aggregation: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
