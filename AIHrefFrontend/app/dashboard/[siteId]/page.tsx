'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { fetchAnalyticsSummary, fetchRealTimeAnalytics, triggerManualAggregation, AnalyticsSummary } from '@/lib/analytics';
import MetricCard from '@/components/MetricCard';
import VisitorsChart from '@/components/VisitorsChart';
import TopPagesChart from '@/components/TopPagesChart';
import TopCountriesChart from '@/components/TopCountriesChart';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

export default function DashboardPage() {
  const params = useParams();
  const siteId = params.siteId as string;

  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<'7d' | '30d' | 'all'>('7d');
  const [dataSource, setDataSource] = useState<'aggregated' | 'realtime'>('aggregated');
  const [isAggregating, setIsAggregating] = useState(false);
  const [aggregationMessage, setAggregationMessage] = useState<string | null>(null);

  useEffect(() => {
    if (siteId) {
      loadAnalytics();
    }
  }, [siteId, selectedRange, dataSource]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = dataSource === 'realtime'
        ? await fetchRealTimeAnalytics(siteId, selectedRange)
        : await fetchAnalyticsSummary(siteId, selectedRange);
      setAnalytics(data);
    } catch (err) {
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

      // Refresh data after successful aggregation
      if (result.status === 'success') {
        await loadAnalytics();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to trigger aggregation');
    } finally {
      setIsAggregating(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadAnalytics} />;
  }

  if (!analytics) {
    return <ErrorMessage message="No analytics data found" onRetry={loadAnalytics} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Site: <span className="font-semibold">{siteId}</span>
          </p>

          {/* Controls */}
          <div className="mt-4 space-y-4">
            {/* Data Source Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Data Source:</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setDataSource('aggregated')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${dataSource === 'aggregated'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                >
                  📊 Aggregated (Daily Snapshots)
                </button>
                <button
                  onClick={() => setDataSource('realtime')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${dataSource === 'realtime'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                >
                  ⚡ Real-time (Raw Events)
                </button>
              </div>
            </div>

            {/* Range Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Time Range:</span>
              <div className="flex space-x-2">
                {(['7d', '30d', 'all'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedRange(range)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedRange === range
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                      }`}
                  >
                    {range === '7d' ? 'Last 7 days' : range === '30d' ? 'Last 30 days' : 'All time'}
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Aggregation Button */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleManualAggregation}
                disabled={isAggregating}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${isAggregating
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-orange-600 text-white hover:bg-orange-700'
                  }`}
              >
                {isAggregating ? (
                  <>
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                    Running Cron Job...
                  </>
                ) : (
                  <>
                    🔄 Run Manual Aggregation
                  </>
                )}
              </button>
              <span className="text-xs text-gray-500">
                (Replicates the midnight scheduled job)
              </span>
            </div>

            {/* Aggregation Message */}
            {aggregationMessage && (
              <div className={`p-3 rounded-lg text-sm ${aggregationMessage.includes('success')
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                {aggregationMessage}
              </div>
            )}
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Visitors"
            value={analytics.visitors.toLocaleString()}
            icon="👥"
            trend="+12%"
          />
          <MetricCard
            title="Total Pageviews"
            value={analytics.pageviews.toLocaleString()}
            icon="📊"
            trend="+8%"
          />
          <MetricCard
            title="Top Page"
            value={analytics.topPages[0]?.url || 'N/A'}
            icon="🔗"
            subtitle={`${analytics.topPages[0]?.count || 0} views`}
          />
          <MetricCard
            title="Top Country"
            value={analytics.topCountries[0]?.country || 'N/A'}
            icon="🌍"
            subtitle={`${analytics.topCountries[0]?.count || 0} visitors`}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visitors Over Time */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Visitors Over Time
            </h3>
            <VisitorsChart data={analytics} />
          </div>

          {/* Top Pages */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Top Pages
            </h3>
            <TopPagesChart data={analytics.topPages} />
          </div>

          {/* Top Countries */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Top Countries
            </h3>
            <TopCountriesChart data={analytics.topCountries} />
          </div>

          {/* Additional Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Additional Statistics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pages per Visitor</span>
                <span className="font-semibold">
                  {analytics.visitors > 0 ? (analytics.pageviews / analytics.visitors).toFixed(2) : '0.00'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Unique Pages</span>
                <span className="font-semibold">{analytics.topPages.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Countries</span>
                <span className="font-semibold">{analytics.topCountries.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
