'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { SourceCount } from '@/lib/analytics';
import { useTheme } from '@/lib/theme-context';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TopSourcesChartProps {
  data: SourceCount[];
}

export default function TopSourcesChart({ data }: TopSourcesChartProps) {
  const { theme } = useTheme();
  const top10Data = data.slice(0, 10);

  const isDark = theme === 'dark';
  const textColor = isDark ? '#e5e7eb' : '#374151';
  const gridColor = isDark ? '#374151' : '#e5e7eb';
  const tooltipBg = isDark ? '#1f2937' : '#ffffff';
  const tooltipBorder = isDark ? '#374151' : '#e5e7eb';

  const chartData = {
    labels: top10Data.map(source => source.source || 'Direct'),
    datasets: [
      {
        label: 'Visitors',
        data: top10Data.map(source => source.count),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(6, 182, 212, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(139, 92, 246)',
          'rgb(236, 72, 153)',
          'rgb(6, 182, 212)',
          'rgb(34, 197, 94)',
          'rgb(251, 146, 60)',
          'rgb(168, 85, 247)',
        ],
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
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
            return context[0].label;
          },
          label: (context: any) => {
            return `Visitors: ${context.parsed.x.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
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
      y: {
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
    },
  };

  return (
    <div className="h-80 w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
}
