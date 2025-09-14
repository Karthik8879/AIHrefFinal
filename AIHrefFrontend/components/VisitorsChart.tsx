'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AnalyticsSummary } from '@/lib/analytics';

interface VisitorsChartProps {
  data: AnalyticsSummary;
}

export default function VisitorsChart({ data }: VisitorsChartProps) {
  // For now, we'll show a simple representation since we don't have time-series data
  // In a real implementation, you'd want to fetch daily snapshots for the time range
  const chartData = [
    { day: 'Day 1', visitors: Math.floor(data.visitors * 0.8) },
    { day: 'Day 2', visitors: Math.floor(data.visitors * 0.9) },
    { day: 'Day 3', visitors: data.visitors },
    { day: 'Day 4', visitors: Math.floor(data.visitors * 0.95) },
    { day: 'Day 5', visitors: Math.floor(data.visitors * 1.1) },
    { day: 'Day 6', visitors: Math.floor(data.visitors * 0.85) },
    { day: 'Day 7', visitors: Math.floor(data.visitors * 1.05) },
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip
            formatter={(value: number) => [value.toLocaleString(), 'Visitors']}
            labelStyle={{ color: '#374151' }}
            contentStyle={{
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Line
            type="monotone"
            dataKey="visitors"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
