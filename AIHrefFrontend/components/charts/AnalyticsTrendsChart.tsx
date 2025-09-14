'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { DailyVisitorCount } from '@/lib/analytics';
import { useTheme } from '@/lib/theme-context';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AnalyticsTrendsChartProps {
  data: DailyVisitorCount[];
  height?: number;
}

export default function AnalyticsTrendsChart({
  data,
  height = 400
}: AnalyticsTrendsChartProps) {
  const { theme } = useTheme();

  // Sort data by date and get last 30 days
  const sortedData = data
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-30);

  // Use real data only - no sample data
  const displayData = sortedData;

  const isDark = theme === 'dark';
  const textColor = isDark ? '#e5e7eb' : '#374151';
  const gridColor = isDark ? '#374151' : '#e5e7eb';
  const tooltipBg = isDark ? '#1f2937' : '#ffffff';
  const tooltipBorder = isDark ? '#374151' : '#e5e7eb';

  const chartData = {
    labels: displayData.map(day => {
      const date = new Date(day.date);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }),
    datasets: [
      {
        label: 'Visitors',
        data: displayData.map(day => day.visitors),
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f620',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        yAxisID: 'y',
      },
      {
        label: 'Page Views',
        data: displayData.map(day => day.pageviews),
        borderColor: '#10b981',
        backgroundColor: '#10b98120',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: textColor,
          font: {
            size: 14,
            weight: '600' as const,
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      title: {
        display: true,
        text: 'Analytics Trends Over Time',
        color: textColor,
        font: {
          size: 18,
          weight: '700' as const,
        },
        padding: {
          bottom: 30,
        },
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: tooltipBorder,
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: true,
        padding: 16,
        titleFont: {
          size: 14,
          weight: '600' as const,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          title: (context: any) => {
            const dataIndex = context[0].dataIndex;
            return new Date(displayData[dataIndex].date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          },
          label: (context: any) => {
            const value = context.parsed.y;
            const label = context.dataset.label;
            return `${label}: ${value.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: gridColor,
          drawBorder: false,
        },
        ticks: {
          color: textColor,
          font: {
            size: 12,
            weight: '500' as const,
          },
          maxTicksLimit: 8,
        },
        border: {
          display: false,
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        beginAtZero: true,
        grid: {
          display: true,
          color: gridColor,
          drawBorder: false,
        },
        ticks: {
          color: textColor,
          font: {
            size: 12,
            weight: '500' as const,
          },
          stepSize: 1,
          callback: function (value: any) {
            return value.toLocaleString();
          },
        },
        border: {
          display: false,
        },
        title: {
          display: true,
          text: 'Visitors',
          color: textColor,
          font: {
            size: 13,
            weight: '600' as const,
          },
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: textColor,
          font: {
            size: 12,
            weight: '500' as const,
          },
          stepSize: 1,
          callback: function (value: any) {
            return value.toLocaleString();
          },
        },
        border: {
          display: false,
        },
        title: {
          display: true,
          text: 'Page Views',
          color: textColor,
          font: {
            size: 13,
            weight: '600' as const,
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  // If no data, show a message
  if (displayData.length === 0) {
    return (
      <div className="w-full flex items-center justify-center" style={{ height: `${height}px` }}>
        <div className="text-center">
          <div className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">
            No Data Available
          </div>
          <div className="text-gray-400 dark:text-gray-500 text-sm">
            Analytics Trends - No data found for the selected time range
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
