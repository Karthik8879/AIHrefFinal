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

interface PerformanceMetricsChartProps {
  data: DailyVisitorCount[];
  height?: number;
}

export default function PerformanceMetricsChart({
  data,
  height = 350
}: PerformanceMetricsChartProps) {
  const { theme } = useTheme();

  // Sort data by date and get last 30 days
  const sortedData = data
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-30);

  // Use real data only - no sample data
  const displayData = sortedData;

  // Calculate derived metrics
  const processedData = displayData.map(day => ({
    date: day.date,
    visitors: day.visitors,
    pageviews: day.pageviews,
    pagesPerVisit: day.pageviews / Math.max(day.visitors, 1), // Avoid division by zero
    bounceRate: Math.max(0, Math.min(100, 100 - (day.pageviews / Math.max(day.visitors, 1)) * 100)), // Simulated bounce rate
  }));

  const isDark = theme === 'dark';
  const textColor = isDark ? '#e5e7eb' : '#374151';
  const gridColor = isDark ? '#374151' : '#e5e7eb';
  const tooltipBg = isDark ? '#1f2937' : '#ffffff';
  const tooltipBorder = isDark ? '#374151' : '#e5e7eb';

  const chartData = {
    labels: processedData.map(day => {
      const date = new Date(day.date);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }),
    datasets: [
      {
        label: 'Pages per Visit',
        data: processedData.map(day => day.pagesPerVisit),
        borderColor: '#8b5cf6',
        backgroundColor: '#8b5cf620',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        yAxisID: 'y',
      },
      {
        label: 'Bounce Rate (%)',
        data: processedData.map(day => day.bounceRate),
        borderColor: '#f59e0b',
        backgroundColor: '#f59e0b20',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: '#f59e0b',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
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
        text: 'Performance Metrics Over Time',
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
            return new Date(processedData[dataIndex].date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          },
          label: (context: any) => {
            const value = context.parsed.y;
            const label = context.dataset.label;
            if (label === 'Bounce Rate (%)') {
              return `${label}: ${value.toFixed(1)}%`;
            }
            return `${label}: ${value.toFixed(2)}`;
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
          stepSize: 0.5,
          callback: function (value: any) {
            return value.toFixed(1);
          },
        },
        border: {
          display: false,
        },
        title: {
          display: true,
          text: 'Pages per Visit',
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
        max: 100,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: textColor,
          font: {
            size: 12,
            weight: '500' as const,
          },
          stepSize: 20,
          callback: function (value: any) {
            return `${value}%`;
          },
        },
        border: {
          display: false,
        },
        title: {
          display: true,
          text: 'Bounce Rate',
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
            Performance Metrics - No data found for the selected time range
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
