'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { fetchAnalyticsSummary, AnalyticsSummary } from '@/lib/analytics';
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

  useEffect(() => {
    if (siteId) {
      loadAnalytics();
    }
  }, [siteId, selectedRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAnalyticsSummary(siteId, selectedRange);
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
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

          {/* Range Selector */}
          <div className="mt-4 flex space-x-2">
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
