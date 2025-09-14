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
  TimeScale,
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
  Filler,
  TimeScale
);

interface TimeSeriesChartProps {
  data: DailyVisitorCount[];
  title: string;
  color?: string;
  height?: number;
  showArea?: boolean;
  showDots?: boolean;
  showGrid?: boolean;
}

export default function TimeSeriesChart({
  data,
  title,
  color = '#3b82f6',
  height = 300,
  showArea = true,
  showDots = true,
  showGrid = true
}: TimeSeriesChartProps) {
  const { theme } = useTheme();

  // Sort data by date and get last 30 days for better visualization
  const sortedData = data
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-30);

  // Use real data only - no sample data
  const displayData = sortedData;

  // Debug logging
  console.log(`TimeSeriesChart [${title}] - Original data:`, data);
  console.log(`TimeSeriesChart [${title}] - Sorted data:`, sortedData);
  console.log(`TimeSeriesChart [${title}] - Display data:`, displayData);
  console.log(`TimeSeriesChart [${title}] - Data length:`, displayData.length);

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
        borderColor: color,
        backgroundColor: showArea ? `${color}20` : 'transparent',
        borderWidth: 3,
        fill: showArea,
        tension: 0.4,
        pointBackgroundColor: showDots ? color : 'transparent',
        pointBorderColor: showDots ? '#ffffff' : 'transparent',
        pointBorderWidth: showDots ? 2 : 0,
        pointRadius: showDots ? 6 : 0,
        pointHoverRadius: showDots ? 8 : 0,
        pointHoverBackgroundColor: color,
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
        color: textColor,
        font: {
          size: 16,
          weight: '600' as const,
        },
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: tooltipBorder,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
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
            const dataIndex = context[0].dataIndex;
            return new Date(sortedData[dataIndex].date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          },
          label: (context: any) => {
            return `Visitors: ${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: showGrid,
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
        beginAtZero: true,
        grid: {
          display: showGrid,
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
      },
    },
    elements: {
      point: {
        hoverBackgroundColor: color,
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
            {title} - No data found for the selected time range
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
