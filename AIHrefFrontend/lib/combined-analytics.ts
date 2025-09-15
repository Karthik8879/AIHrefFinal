import { EnhancedAnalytics } from './analytics';

export interface CombinedAnalytics {
  totalVisitors: number;
  totalTodayVisitors: number;
  totalWeekVisitors: number;
  totalMonthVisitors: number;
  totalRepeatVisitors: number;
  topCountries: Array<{ country: string; count: number }>;
  topPages: Array<{ page: string; count: number }>;
  topSources: Array<{ source: string; count: number }>;
  dailyVisitors: Array<{ date: string; count: number }>;
  sites: Array<{
    siteId: string;
    siteName: string;
    website: string;
    visitors: number;
    todayVisitors: number;
  }>;
}

export async function fetchCombinedAnalytics(range: "7d" | "1m" | "1y" | "5y" = "7d"): Promise<CombinedAnalytics> {
  const sites = [
    { siteId: 'greplus', siteName: 'GRE Plus', website: 'greplus.com' },
    { siteId: 'novareaders', siteName: 'Nova Readers', website: 'novareaders.com' },
    { siteId: 'aixrayassist', siteName: 'AI X-Ray Assist', website: 'aixrayassist.com' },
    { siteId: 'aihref', siteName: 'AIHref', website: 'aihref.com' }
  ];

  try {
    // Fetch analytics for all sites
    const analyticsPromises = sites.map(async (site) => {
      try {
        const response = await fetch(`http://localhost:8080/api/analytics/enhanced/${site.siteId}?range=${range}`);
        if (!response.ok) {
          console.warn(`Failed to fetch analytics for ${site.siteId}`);
          return null;
        }
        const data = await response.json();
        return { ...site, ...data };
      } catch (error) {
        console.warn(`Error fetching analytics for ${site.siteId}:`, error);
        return null;
      }
    });

    const analyticsResults = await Promise.all(analyticsPromises);
    const validAnalytics = analyticsResults.filter(Boolean);

    // Combine analytics data
    const combined: CombinedAnalytics = {
      totalVisitors: 0,
      totalTodayVisitors: 0,
      totalWeekVisitors: 0,
      totalMonthVisitors: 0,
      totalRepeatVisitors: 0,
      topCountries: [],
      topPages: [],
      topSources: [],
      dailyVisitors: [],
      sites: []
    };

    // Aggregate visitor counts
    validAnalytics.forEach(analytics => {
      if (analytics) {
        combined.totalVisitors += analytics.totalVisitorsTillDate || 0;
        combined.totalTodayVisitors += analytics.todayVisitors || 0;
        combined.totalWeekVisitors += analytics.thisWeekVisitors || 0;
        combined.totalMonthVisitors += analytics.thisMonthVisitors || 0;
        combined.totalRepeatVisitors += analytics.repeatVisitorsToday || 0;

        combined.sites.push({
          siteId: analytics.siteId,
          siteName: analytics.siteName,
          website: analytics.website,
          visitors: analytics.totalVisitorsTillDate || 0,
          todayVisitors: analytics.todayVisitors || 0
        });
      }
    });

    // Aggregate top countries
    const countryMap = new Map<string, number>();
    validAnalytics.forEach(analytics => {
      if (analytics?.topCountries) {
        analytics.topCountries.forEach((country: any) => {
          const current = countryMap.get(country.country) || 0;
          countryMap.set(country.country, current + country.count);
        });
      }
    });
    combined.topCountries = Array.from(countryMap.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Aggregate top pages
    const pageMap = new Map<string, number>();
    validAnalytics.forEach(analytics => {
      if (analytics?.topPages) {
        analytics.topPages.forEach((page: any) => {
          const current = pageMap.get(page.page) || 0;
          pageMap.set(page.page, current + page.count);
        });
      }
    });
    combined.topPages = Array.from(pageMap.entries())
      .map(([page, count]) => ({ page, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Aggregate top sources
    const sourceMap = new Map<string, number>();
    validAnalytics.forEach(analytics => {
      if (analytics?.topSources) {
        analytics.topSources.forEach((source: any) => {
          const current = sourceMap.get(source.source) || 0;
          sourceMap.set(source.source, current + source.count);
        });
      }
    });
    combined.topSources = Array.from(sourceMap.entries())
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Aggregate daily visitors
    const dailyMap = new Map<string, number>();
    validAnalytics.forEach(analytics => {
      if (analytics?.dailyVisitors) {
        analytics.dailyVisitors.forEach((daily: any) => {
          const current = dailyMap.get(daily.date) || 0;
          dailyMap.set(daily.date, current + daily.count);
        });
      }
    });
    combined.dailyVisitors = Array.from(dailyMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return combined;
  } catch (error) {
    console.error('Error fetching combined analytics:', error);
    throw new Error('Failed to fetch combined analytics');
  }
}
