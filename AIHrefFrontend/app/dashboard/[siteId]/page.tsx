'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  fetchEnhancedAnalytics,
  triggerManualAggregation,
  EnhancedAnalytics,
  fetchDailySnapshots,
  aggregateDailySnapshots,
  DailySnapshot
} from '@/lib/analytics';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import VisitorTrendsChart from '@/components/charts/VisitorTrendsChart';
import TopCountriesChart from '@/components/charts/TopCountriesChart';
import TopSourcesChart from '@/components/charts/TopSourcesChart';
import TopLocationsChart from '@/components/charts/TopLocationsChart';
import TrafficSummaryChart from '@/components/charts/TrafficSummaryChart';
import TimeSeriesChart from '@/components/charts/TimeSeriesChart';
import AnalyticsTrendsChart from '@/components/charts/AnalyticsTrendsChart';
import PerformanceMetricsChart from '@/components/charts/PerformanceMetricsChart';
import ThemeToggle from '@/components/ThemeToggle';

export default function DashboardPage() {
  const params = useParams();
  const siteId = params.siteId as string;

  const [analytics, setAnalytics] = useState<EnhancedAnalytics | null>(null);
  const [dailySnapshots, setDailySnapshots] = useState<DailySnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<'7d' | '1m' | '1y' | '5y'>('7d');
  const [isAggregating, setIsAggregating] = useState(false);
  const [aggregationMessage, setAggregationMessage] = useState<string | null>(null);

  useEffect(() => {
    if (siteId) {
      loadAnalytics();
    }
  }, [siteId, selectedRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Loading analytics for siteId:', siteId, 'range:', selectedRange);

      // Fetch both enhanced analytics and daily snapshots
      const [analyticsData, snapshotsData] = await Promise.all([
        fetchEnhancedAnalytics(siteId, selectedRange),
        fetchDailySnapshots(siteId, selectedRange)
      ]);

      console.log('Analytics data:', analyticsData);
      console.log('Snapshots data:', snapshotsData);

      setAnalytics(analyticsData);
      setDailySnapshots(snapshotsData);
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleManualAggregation = async () => {
    try {
      setIsAggregating(true);
      setAggregationMessage(null);
      setError(null);
      const result = await triggerManualAggregation();
      setAggregationMessage(result.message);
      if (result.status === 'success') {
        await loadAnalytics(); // Refresh data after aggregation
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to trigger aggregation');
    } finally {
      setIsAggregating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <ErrorMessage message="No analytics data available" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Portfolio Analytics Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Site: <span className="font-semibold text-blue-600 dark:text-blue-400">{siteId}</span>
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Time Range Selector */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Range:</span>
                  <div className="flex space-x-1">
                    {(['7d', '1m', '1y', '5y'] as const).map((range) => (
                      <button
                        key={range}
                        onClick={() => setSelectedRange(range)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${selectedRange === range
                          ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:border-blue-300'
                          }`}
                      >
                        {range === '7d' ? '7D' :
                          range === '1m' ? '1M' :
                            range === '1y' ? '1Y' : '5Y'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Manual Aggregation Button */}
              <button
                onClick={handleManualAggregation}
                disabled={isAggregating}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isAggregating
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transform hover:scale-105'
                  }`}
              >
                {isAggregating ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Processing...
                  </>
                ) : (
                  '🔄 Run Aggregation'
                )}
              </button>
            </div>
          </div>

          {aggregationMessage && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="text-sm text-green-700 dark:text-green-300 font-medium">
                ✅ {aggregationMessage}
              </div>
            </div>
          )}
        </div>

        {/* Traffic Summary Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
            <span className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3"></span>
            Traffic Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{analytics.totalVisitorsTillDate.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">Total Visitors till date</div>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">{analytics.todayVisitors.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">Today's Visitors</div>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📅</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{analytics.thisWeekVisitors.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">This Week</div>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{analytics.thisMonthVisitors.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">This Month</div>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">{analytics.repeatVisitorsToday.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">Repeat Visitors Today</div>
                </div>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🔄</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
            <span className="w-1 h-8 bg-gradient-to-b from-green-500 to-blue-500 rounded-full mr-3"></span>
            Performance Over Time
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{analytics.avgVisitsPerDay.toFixed(2)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">Avg. Visits / Day</div>
              <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: `${Math.min(analytics.avgVisitsPerDay * 10, 100)}%` }}></div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{analytics.avgVisitsPerWeek.toFixed(2)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">Avg. Visits / Week</div>
              <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" style={{ width: `${Math.min(analytics.avgVisitsPerWeek * 2, 100)}%` }}></div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{analytics.avgRepeatVisitorsPerDay.toFixed(2)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">Avg. Repeat Visitors / Day</div>
              <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full" style={{ width: `${Math.min(analytics.avgRepeatVisitorsPerDay * 20, 100)}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Time Series Charts Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
            <span className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3"></span>
            Time Series Analytics
          </h2>

          <div className="grid grid-cols-1 gap-8">
            {/* Analytics Trends Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <AnalyticsTrendsChart
                data={dailySnapshots.length > 0 ? aggregateDailySnapshots(dailySnapshots) : []}
                height={400}
              />
            </div>

            {/* Performance Metrics Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <PerformanceMetricsChart
                data={dailySnapshots.length > 0 ? aggregateDailySnapshots(dailySnapshots) : []}
                height={350}
              />
            </div>

            {/* Individual Time Series Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                <TimeSeriesChart
                  data={dailySnapshots.length > 0 ? aggregateDailySnapshots(dailySnapshots) : []}
                  title="Daily Visitor Trends"
                  color="#3b82f6"
                  height={300}
                />
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                <TimeSeriesChart
                  data={dailySnapshots.length > 0 ? aggregateDailySnapshots(dailySnapshots) : []}
                  title="Page Views Over Time"
                  color="#10b981"
                  height={300}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
            <span className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full mr-3"></span>
            Analytics Visualization
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Visitor Trends Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Visitor Trends (7 Days)</h3>
                <div className="flex space-x-1">
                  {(['7d', '1m', '1y', '5y'] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => setSelectedRange(range)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-all ${selectedRange === range
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                      {range === '7d' ? '7D' :
                        range === '1m' ? '1M' :
                          range === '1y' ? '1Y' : '5Y'}
                    </button>
                  ))}
                </div>
              </div>
              <VisitorTrendsChart data={analytics.dailyVisitorTrends} />
            </div>

            {/* Top Locations Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Top 5 Locations</h3>
              <TopLocationsChart data={analytics.topLocations} />
            </div>

            {/* Top Countries Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Visitors by Top 10 Countries</h3>
              <TopCountriesChart data={analytics.topCountries} />
            </div>

            {/* Top Sources Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Visitors by Top 10 Sources</h3>
              <TopSourcesChart data={analytics.topSources} />
            </div>
          </div>
        </div>

        {/* Highest Performing Segments */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
            <span className="w-1 h-8 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-full mr-3"></span>
            Highest Performing Segments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {analytics.peakVisitDay}
                  </div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{analytics.peakVisitCount}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">Peak Visit Day</div>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📅</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{analytics.topCountry}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">Top Country</div>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🌍</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{analytics.topSource || 'Direct'}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">Top Source</div>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🔗</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {new Date(analytics.lastUpdated).toLocaleString()}
            </p>
            <div className="mt-2 flex justify-center space-x-4 text-xs text-gray-400 dark:text-gray-500">
              <span>📊 Real-time Analytics</span>
              <span>•</span>
              <span>🔄 Auto-refresh</span>
              <span>•</span>
              <span>📈 Interactive Charts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}