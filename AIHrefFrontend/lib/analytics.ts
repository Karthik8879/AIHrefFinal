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

// Database format interfaces
export interface DailySnapshot {
  _id: { $oid: string };
  siteId: string;
  date: { $date: { $numberLong: string } };
  visitors: { $numberLong: string };
  pageviews: { $numberLong: string };
  topPages: Array<{
    url: string;
    count: { $numberLong: string };
  }>;
  topCountries: Array<{
    country: string;
    count: { $numberLong: string };
  }>;
  _class: string;
}

export interface RawEvent {
  _id: { $oid: string };
  siteId: string;
  eventType: string;
  anonId: string;
  url: string;
  referrer: string;
  userAgent: string;
  ts: { $date: { $numberLong: string } };
  country: string;
  city: string;
  _class: string;
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

// Utility functions to convert database format to chart format
export function convertDailySnapshotToVisitorCount(snapshot: any): DailyVisitorCount {
  try {
    console.log('convertDailySnapshotToVisitorCount - Input snapshot:', snapshot);

    // Handle both MongoDB format and API response format
    if (typeof snapshot.date === 'string') {
      // API response format (already converted by backend)
      const result = {
        date: snapshot.date,
        visitors: snapshot.visitors,
        pageviews: snapshot.pageviews
      };
      console.log('convertDailySnapshotToVisitorCount - API format result:', result);
      return result;
    } else {
      // MongoDB format (raw database format)
      const result = {
        date: new Date(parseInt(snapshot.date.$date.$numberLong)).toISOString().split('T')[0],
        visitors: parseInt(snapshot.visitors.$numberLong),
        pageviews: parseInt(snapshot.pageviews.$numberLong)
      };
      console.log('convertDailySnapshotToVisitorCount - MongoDB format result:', result);
      return result;
    }
  } catch (error) {
    console.error('Error in convertDailySnapshotToVisitorCount:', error, 'snapshot:', snapshot);
    return {
      date: new Date().toISOString().split('T')[0],
      visitors: 0,
      pageviews: 0
    };
  }
}

export function convertDailySnapshotsToVisitorCounts(snapshots: any[]): DailyVisitorCount[] {
  return snapshots.map(convertDailySnapshotToVisitorCount);
}

export function convertDailySnapshotToPageCount(snapshot: any): PageCount[] {
  return snapshot.topPages.map((page: any) => ({
    url: page.url,
    count: typeof page.count === 'number' ? page.count : parseInt(page.count.$numberLong)
  }));
}

export function convertDailySnapshotToCountryCount(snapshot: any): CountryCount[] {
  return snapshot.topCountries.map((country: any) => ({
    country: country.country,
    count: typeof country.count === 'number' ? country.count : parseInt(country.count.$numberLong)
  }));
}

// Function to aggregate daily snapshots for time series data
export function aggregateDailySnapshots(snapshots: any[]): DailyVisitorCount[] {
  try {
    console.log('aggregateDailySnapshots - Input snapshots:', snapshots);

    const sortedSnapshots = snapshots.sort((a, b) => {
      // Handle both API response format and MongoDB format
      const dateA = typeof a.date === 'string' ? new Date(a.date) : new Date(parseInt(a.date.$date.$numberLong));
      const dateB = typeof b.date === 'string' ? new Date(b.date) : new Date(parseInt(b.date.$date.$numberLong));
      return dateA.getTime() - dateB.getTime();
    });

    console.log('aggregateDailySnapshots - Sorted snapshots:', sortedSnapshots);

    const result = convertDailySnapshotsToVisitorCounts(sortedSnapshots);
    console.log('aggregateDailySnapshots - Result:', result);

    return result;
  } catch (error) {
    console.error('Error in aggregateDailySnapshots:', error);
    return [];
  }
}

// New API function to fetch raw daily snapshots
export async function fetchDailySnapshots(
  siteId: string,
  range: '7d' | '1m' | '30d' | '1y' | '5y' | 'all' = '7d'
): Promise<DailySnapshot[]> {
  const url = `${API_BASE_URL}/api/analytics/daily-snapshots?siteId=${encodeURIComponent(siteId)}&range=${range}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch daily snapshots: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// New API function to fetch raw events
export async function fetchRawEvents(
  siteId: string,
  range: '7d' | '1m' | '30d' | '1y' | '5y' | 'all' = '7d'
): Promise<RawEvent[]> {
  const url = `${API_BASE_URL}/api/analytics/raw-events?siteId=${encodeURIComponent(siteId)}&range=${range}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch raw events: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
