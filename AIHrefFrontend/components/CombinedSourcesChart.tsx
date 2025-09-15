"use client";

import type { CombinedAnalytics } from "@/lib/combined-analytics";
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
import { getSiteColor, getSiteName } from "@/lib/chart-colors";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CombinedSourcesChartProps {
  analytics: CombinedAnalytics;
}

export default function CombinedSourcesChart({
  analytics,
}: CombinedSourcesChartProps) {
  // Get top 10 sources from the combined analytics data
  const topSources = analytics.topSources.slice(0, 10);

  // Create datasets for each site
  const datasets = analytics.sites.map(site => {
    const color = getSiteColor(site.siteId);
    const siteName = getSiteName(site.siteId);

    // For demonstration, we'll distribute source data proportionally
    // In a real implementation, you'd want actual site-specific source data
    const siteData = topSources.map(source => {
      const siteRatio = site.visitors / analytics.totalVisitors;
      return Math.round(source.count * siteRatio);
    });

    return {
      label: siteName,
      data: siteData,
      backgroundColor: color.background,
      borderColor: color.border,
      borderWidth: 1,
      borderRadius: 4,
      borderSkipped: false,
    };
  });

  const data = {
    labels: topSources.map((source) => source.source || "Direct"),
    datasets: datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgb(34, 197, 94)",
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: function (context: any) {
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()} visitors`;
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
    <ChartContainer title="Visitors by Top 10 Sources (Combined)">
      <Bar data={data} options={options} />
    </ChartContainer>
  );
}
