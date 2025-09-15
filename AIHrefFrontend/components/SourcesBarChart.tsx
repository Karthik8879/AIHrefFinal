"use client";

import { EnhancedAnalytics } from "@/lib/analytics";
import ChartContainer from "./ChartContainer";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SourcesBarChartProps {
  analytics: EnhancedAnalytics;
}

export default function SourcesBarChart({ analytics }: SourcesBarChartProps) {
  // Get top 10 sources from the analytics data
  const topSources = analytics.topSources.slice(0, 10);

  const data = {
    labels: topSources.map((source) => source.source),
    datasets: [
      {
        label: "Visitors",
        data: topSources.map((source) => source.count),
        backgroundColor: "rgba(34, 197, 94, 0.8)",
        borderColor: "rgb(34, 197, 94)",
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
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
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgb(34, 197, 94)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function (context: { parsed: { y: number } }) {
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
          color: "rgb(107, 114, 128)",
          font: {
            size: 11,
          },
          maxRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(156, 163, 175, 0.2)",
          drawBorder: false,
        },
        ticks: {
          color: "rgb(107, 114, 128)",
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <ChartContainer title="Visitors by Top 10 Sources">
      <Bar data={data} options={options} />
    </ChartContainer>
  );
}
