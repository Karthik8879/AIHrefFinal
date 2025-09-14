interface MetricCardProps {
  title: string;
  value: string;
  icon: string;
  trend?: string;
  subtitle?: string;
}

export default function MetricCard({ title, value, icon, trend, subtitle }: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <span className="text-green-600 text-sm font-medium">{trend}</span>
          <span className="text-gray-500 text-sm ml-1">vs last period</span>
        </div>
      )}
    </div>
  );
}
