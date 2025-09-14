'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { fetchEnhancedAnalytics, EnhancedAnalytics } from '@/lib/analytics';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

export default function EnhancedDashboardPage() {
  const params = useParams();
  const siteId = params.siteId as string;

  const [analytics, setAnalytics] = useState<EnhancedAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<'7d' | '1m' | '30d' | '1y' | '5y' | 'all'>('7d');

  useEffect(() => {
    if (siteId) {
      loadAnalytics();
    }
  }, [siteId, selectedRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchEnhancedAnalytics(siteId, selectedRange);
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage message="No analytics data available" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Portfolio Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Site: <span className="font-semibold">{siteId}</span>
          </p>

          {/* Time Range Selector */}
          <div className="mt-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Time Range:</span>
              <div className="flex space-x-2">
                {(['7d', '1m', '1y', '5y'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedRange(range)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedRange === range
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
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
        </div>

        {/* Traffic Summary */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Traffic Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-2xl font-bold text-blue-600">{analytics.totalVisitorsTillDate.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Visitors till date</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-2xl font-bold text-green-600">{analytics.todayVisitors.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Today's Visitors</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-2xl font-bold text-purple-600">{analytics.thisWeekVisitors.toLocaleString()}</div>
              <div className="text-sm text-gray-600">This Week</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-2xl font-bold text-orange-600">{analytics.thisMonthVisitors.toLocaleString()}</div>
              <div className="text-sm text-gray-600">This Month</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-2xl font-bold text-red-600">{analytics.repeatVisitorsToday.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Repeat Visitors Today</div>
            </div>
          </div>
        </div>

        {/* Highest Performing Segments */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Highest Performing Segments</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-lg font-semibold text-gray-900">
                {analytics.peakVisitDay} ({analytics.peakVisitCount})
              </div>
              <div className="text-sm text-gray-600">Peak Visit Day</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-lg font-semibold text-gray-900">{analytics.topCountry}</div>
              <div className="text-sm text-gray-600">Top Country</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-lg font-semibold text-gray-900">{analytics.topSource || 'Direct'}</div>
              <div className="text-sm text-gray-600">Top Source</div>
            </div>
          </div>
        </div>

        {/* Performance Over Time */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Over Time (Last 6 months)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-lg font-semibold text-gray-900">{analytics.avgVisitsPerDay.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Avg. Visits / Day</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-lg font-semibold text-gray-900">{analytics.avgVisitsPerWeek.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Avg. Visits / Week</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-lg font-semibold text-gray-900">{analytics.avgRepeatVisitorsPerDay.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Avg. Repeat Visitors / Day</div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top 5 Locations */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Locations</h3>
            <div className="space-y-3">
              {analytics.topLocations.slice(0, 5).map((location, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700">
                    {location.city !== 'Unknown' ? `${location.city}, ${location.state}` : location.country}
                  </span>
                  <span className="font-semibold text-blue-600">{location.count} visits</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visitor Trends */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Visitor Trends</h3>
            <p className="text-sm text-gray-600 mb-4">Visits - Last 7 Days</p>
            {analytics.dailyVisitorTrends.length > 0 ? (
              <div className="space-y-2">
                {analytics.dailyVisitorTrends.slice(-7).map((day, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {new Date(day.date).toLocaleDateString()}
                    </span>
                    <span className="font-semibold">{day.visitors} visits</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No daily trends data available</p>
            )}
          </div>

          {/* Top Countries */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Visitors by Top 10 Countries</h3>
            <div className="space-y-2">
              {analytics.topCountries.slice(0, 10).map((country, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700">{country.country}</span>
                  <span className="font-semibold text-blue-600">{country.count} visitors</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Sources */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Visitors by Top 10 Sources</h3>
            <div className="space-y-2">
              {analytics.topSources.slice(0, 10).map((source, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700">{source.source || 'Direct'}</span>
                  <span className="font-semibold text-blue-600">{source.count} visitors</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Last updated: {new Date(analytics.lastUpdated).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
