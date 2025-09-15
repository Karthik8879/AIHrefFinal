"use client";

import type { CombinedAnalytics } from "@/lib/combined-analytics";
import MetricCard from "./MetricCard";
import VisitorIcon from "./icons/VisitorIcon";
import ClockIcon from "./icons/ClockIcon";
import CalendarIcon from "./icons/CalendarIcon";
import CombinedVisitorTrendsChart from "./CombinedVisitorTrendsChart";
import CombinedCountriesChart from "./CombinedCountriesChart";
import CombinedSourcesChart from "./CombinedSourcesChart";

interface CombinedAnalyticsProps {
  analytics: CombinedAnalytics;
  selectedRange?: "7d" | "1m" | "1y" | "5y";
}

export default function CombinedAnalytics({ analytics, selectedRange = "7d" }: CombinedAnalyticsProps) {
  console.log("CombinedAnalytics received data:", analytics);
  console.log("Daily visitors:", analytics.dailyVisitors);
  console.log("Sites:", analytics.sites);

  return (
    <div className="space-y-8">
      {/* Overview Metrics */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Combined Analytics Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <MetricCard
            title="Total Visitors"
            value={analytics.totalVisitors}
            icon={<VisitorIcon />}
            iconBgColor="bg-blue-100 dark:bg-blue-900/30"
            iconColor="text-blue-600 dark:text-blue-400"
          />
          <MetricCard
            title="Today's Visitors"
            value={analytics.totalTodayVisitors}
            icon={<ClockIcon />}
            iconBgColor="bg-green-100 dark:bg-green-900/30"
            iconColor="text-green-600 dark:text-green-400"
          />
          <MetricCard
            title="This Week"
            value={analytics.totalWeekVisitors}
            icon={<CalendarIcon />}
            iconBgColor="bg-purple-100 dark:bg-purple-900/30"
            iconColor="text-purple-600 dark:text-purple-400"
          />
          <MetricCard
            title="This Month"
            value={analytics.totalMonthVisitors}
            icon={<CalendarIcon />}
            iconBgColor="bg-orange-100 dark:bg-orange-900/30"
            iconColor="text-orange-600 dark:text-orange-400"
          />
          <MetricCard
            title="Repeat Visitors"
            value={analytics.totalRepeatVisitors}
            icon={<VisitorIcon />}
            iconBgColor="bg-teal-100 dark:bg-teal-900/30"
            iconColor="text-teal-600 dark:text-teal-400"
          />
        </div>
      </div>

      {/* Sites Performance */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Sites Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {analytics.sites.map((site) => (
            <div key={site.siteId} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{site.siteName}</h3>
                  <a
                    href={`https://${site.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    {site.website}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {site.siteName.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Total Visitors:</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {site.visitors.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Today:</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {site.todayVisitors.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Analytics Charts</h2>

        {/* Visitor Trends Chart */}
        <div className="mb-8">
          <CombinedVisitorTrendsChart analytics={analytics} selectedRange={selectedRange} />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Countries Chart */}
          <div>
            <CombinedCountriesChart analytics={analytics} />
          </div>

          {/* Sources Chart */}
          <div>
            <CombinedSourcesChart analytics={analytics} />
          </div>
        </div>
      </div>

      {/* Top Countries */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Top Countries</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="space-y-3">
            {analytics.topCountries.slice(0, 10).map((country, index) => (
              <div key={country.country} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-300">
                    {index + 1}
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">{country.country}</span>
                </div>
                <span className="text-gray-600 dark:text-gray-300 font-semibold">
                  {country.count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Pages */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Top Pages</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="space-y-3">
            {analytics.topPages.slice(0, 10).map((page, index) => (
              <div key={page.page} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-300">
                    {index + 1}
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium truncate">{page.page}</span>
                </div>
                <span className="text-gray-600 dark:text-gray-300 font-semibold">
                  {page.count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Sources */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Top Traffic Sources</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="space-y-3">
            {analytics.topSources.slice(0, 10).map((source, index) => (
              <div key={source.source} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-300">
                    {index + 1}
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">{source.source}</span>
                </div>
                <span className="text-gray-600 dark:text-gray-300 font-semibold">
                  {source.count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
