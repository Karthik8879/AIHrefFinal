
export interface CombinedAnalytics {
  totalVisitors: number;
  totalTodayVisitors: number;
  totalWeekVisitors: number;
  totalMonthVisitors: number;
  totalRepeatVisitors: number;
  topCountries: Array<{ country: string; count: number }>;
  topPages: Array<{ page: string; count: number }>;
  topSources: Array<{ source: string; count: number }>;
  dailyVisitors: Array<{ date: string; visitors: number; pageviews: number }>;
  sites: Array<{
    siteId: string;
    siteName: string;
    website: string;
    visitors: number;
    todayVisitors: number;
    weekVisitors: number;
    monthVisitors: number;
    repeatVisitors: number;
  }>;
}

export async function fetchCombinedAnalytics(range: "7d" | "1m" | "1y" | "5y" = "7d"): Promise<CombinedAnalytics> {
  try {
    const response = await fetch(`http://localhost:8080/api/analytics/combined?range=${range}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Transform backend response to frontend format
    const combined: CombinedAnalytics = {
      totalVisitors: data.totalVisitors || 0,
      totalTodayVisitors: data.totalTodayVisitors || 0,
      totalWeekVisitors: data.totalWeekVisitors || 0,
      totalMonthVisitors: data.totalMonthVisitors || 0,
      totalRepeatVisitors: data.totalRepeatVisitors || 0,
      topCountries: data.topCountries || [],
      topPages: data.topPages || [],
      topSources: data.topSources || [],
      dailyVisitors: data.dailyVisitors || [],
      sites: data.sites || []
    };

    return combined;

  } catch (error) {
    console.error('Error fetching combined analytics:', error);
    throw new Error('Failed to fetch combined analytics');
  }
}
