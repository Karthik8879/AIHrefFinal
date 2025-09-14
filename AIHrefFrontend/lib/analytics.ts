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
  range: '7d' | '30d' | 'all' = '7d'
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
