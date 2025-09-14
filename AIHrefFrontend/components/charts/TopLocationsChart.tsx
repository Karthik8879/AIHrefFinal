'use client';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { LocationCount } from '@/lib/analytics';
import { useTheme } from '@/lib/theme-context';

ChartJS.register(ArcElement, Tooltip, Legend);

interface TopLocationsChartProps {
  data: LocationCount[];
}

export default function TopLocationsChart({ data }: TopLocationsChartProps) {
  const { theme } = useTheme();
  const top5Data = data.slice(0, 5);

  const isDark = theme === 'dark';
  const textColor = isDark ? '#e5e7eb' : '#374151';
  const tooltipBg = isDark ? '#1f2937' : '#ffffff';
  const tooltipBorder = isDark ? '#374151' : '#e5e7eb';

  const chartData = {
    labels: top5Data.map(location =>
      location.city !== 'Unknown' ? `${location.city}, ${location.state}` : location.country
    ),
    datasets: [
      {
        data: top5Data.map(location => location.count),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(139, 92, 246)',
        ],
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
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
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.parsed.toLocaleString()} visits (${percentage}%)`;
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
    <div className="h-80 w-full">
      <Pie data={chartData} options={options} />
    </div>
  );
}
