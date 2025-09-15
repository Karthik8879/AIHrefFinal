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

interface CountriesBarChartProps {
  analytics: EnhancedAnalytics;
}

export default function CountriesBarChart({
  analytics,
}: CountriesBarChartProps) {
  // Get top 10 countries from the analytics data
  const topCountries = analytics.topCountries.slice(0, 10);

  const data = {
    labels: topCountries.map((country) => country.country),
    datasets: [
      {
        label: "Visitors",
        data: topCountries.map((country) => country.count),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgb(59, 130, 246)",
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
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function (context: any) {
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
    <ChartContainer title="Visitors by Top 10 Countries">
      <Bar data={data} options={options} />
    </ChartContainer>
  );
}
