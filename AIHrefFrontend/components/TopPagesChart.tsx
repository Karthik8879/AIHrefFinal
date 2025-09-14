'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PageCount } from '@/lib/analytics';

interface TopPagesChartProps {
  data: PageCount[];
}

export default function TopPagesChart({ data }: TopPagesChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No page data available
      </div>
    );
  }

  // Truncate long URLs for better display
  const chartData = data.map(item => ({
    ...item,
    displayUrl: item.url.length > 30 ? item.url.substring(0, 30) + '...' : item.url
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis
            type="category"
            dataKey="displayUrl"
            width={120}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value: number) => [value.toLocaleString(), 'Views']}
            labelFormatter={(label, payload) => {
              if (payload && payload[0]) {
                return payload[0].payload.url; // Show full URL in tooltip
              }
              return label;
            }}
            labelStyle={{ color: '#374151' }}
            contentStyle={{
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Bar
            dataKey="count"
            fill="#10b981"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
