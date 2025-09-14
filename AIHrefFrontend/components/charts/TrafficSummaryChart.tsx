'use client';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { EnhancedAnalytics } from '@/lib/analytics';
import { useTheme } from '@/lib/theme-context';

ChartJS.register(ArcElement, Tooltip, Legend);

interface TrafficSummaryChartProps {
  data: EnhancedAnalytics;
}

export default function TrafficSummaryChart({ data }: TrafficSummaryChartProps) {
  const { theme } = useTheme();

  const isDark = theme === 'dark';
  const textColor = isDark ? '#e5e7eb' : '#374151';
  const tooltipBg = isDark ? '#1f2937' : '#ffffff';
  const tooltipBorder = isDark ? '#374151' : '#e5e7eb';

  const chartData = {
    labels: ['Today', 'This Week', 'This Month', 'Repeat Today'],
    datasets: [
      {
        data: [
          data.todayVisitors,
          data.thisWeekVisitors,
          data.thisMonthVisitors,
          data.repeatVisitorsToday,
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(139, 92, 246)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 12,
            weight: '500' as const,
          },
          color: textColor,
        },
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: tooltipBorder,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        padding: 12,
        titleFont: {
          size: 14,
          weight: '600' as const,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          title: (context: any) => {
            return context[0].label;
          },
          label: (context: any) => {
            return `${context.parsed.toLocaleString()} visitors`;
          },
        },
      },
    },
    elements: {
      arc: {
        borderWidth: 3,
      },
    },
  };

  return (
    <div className="h-64 w-full">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
