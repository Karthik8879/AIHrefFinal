import Link from "next/link";
import Navigation from "@/components/Navigation";

export default function Home() {
  const sampleSites = [
    { id: 'greplus', name: 'GRE Plus', description: 'GRE preparation platform' },
    { id: 'test-site-1', name: 'Test Site 1', description: 'Demo analytics with dummy data' },
    { id: 'novareaders', name: 'Nova Readers', description: 'Reading analytics platform' },
    { id: 'example', name: 'Example Site', description: 'Sample analytics dashboard' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AIHref Analytics Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Monitor your website analytics with real-time insights, visitor tracking, and detailed performance metrics.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Analytics</h3>
            <p className="text-gray-600">Track visitors, pageviews, and user behavior in real-time</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Geographic Insights</h3>
            <p className="text-gray-600">Understand where your visitors are coming from</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Tracking</h3>
            <p className="text-gray-600">Monitor top pages and user engagement metrics</p>
          </div>
        </div>

        {/* Sample Sites */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            View Analytics Dashboard
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Select a site to view its analytics dashboard:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleSites.map((site) => (
              <Link
                key={site.id}
                href={`/dashboard/${site.id}`}
                className="block p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                  {site.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{site.description}</p>
                <div className="flex items-center text-blue-600 text-sm font-medium">
                  View Dashboard
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Test Analytics Section */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-purple-900 mb-3">🧪 Test Analytics with Dummy Data</h3>
            <p className="text-purple-800 mb-4">
              Want to see how the analytics look with sample data? Check out our test dashboard!
            </p>
            <Link
              href="/test-analytics"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              🚀 Go to Test Analytics
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Getting Started</h3>
          <div className="text-blue-800 space-y-2">
            <p>1. Make sure your Spring Boot backend is running on <code className="bg-blue-100 px-2 py-1 rounded">http://localhost:8080</code></p>
            <p>2. Click on any site above to view its analytics dashboard</p>
            <p>3. Use the time range selector (7d, 30d, all) to filter data</p>
            <p>4. The dashboard will automatically refresh when new data is available</p>
          </div>
        </div>
      </div>
    </div>
  );
}