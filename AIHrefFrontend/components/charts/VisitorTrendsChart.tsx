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

interface VisitorTrendsChartProps {
  data: DailyVisitorCount[];
}

export default function VisitorTrendsChart({ data }: VisitorTrendsChartProps) {
  const { theme } = useTheme();

  // Sort data by date and get last 7 days
  const sortedData = data
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7);

  const isDark = theme === 'dark';
  const textColor = isDark ? '#e5e7eb' : '#374151';
  const gridColor = isDark ? '#374151' : '#e5e7eb';
  const tooltipBg = isDark ? '#1f2937' : '#ffffff';
  const tooltipBorder = isDark ? '#374151' : '#e5e7eb';

  const chartData = {
    labels: sortedData.map(day => {
      const date = new Date(day.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Visitors',
        data: sortedData.map(day => day.visitors),
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
          display: false,
        },
        ticks: {
          color: textColor,
          font: {
            size: 12,
            weight: '500' as const,
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
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
        hoverBackgroundColor: '#3b82f6',
      },
    },
  };

  return (
    <div className="h-64 w-full">
      <Line data={chartData} options={options} />
    </div>
  );
}
