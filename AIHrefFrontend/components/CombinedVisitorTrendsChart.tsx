"use client";

import type { CombinedAnalytics } from "@/lib/combined-analytics";
import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { getSiteColor, getSiteName } from "@/lib/chart-colors";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ChartDataLabels
);

interface CombinedVisitorTrendsChartProps {
  analytics: CombinedAnalytics;
  selectedRange: "7d" | "1m" | "1y" | "5y";
}

export default function CombinedVisitorTrendsChart({
  analytics,
  selectedRange,
}: CombinedVisitorTrendsChartProps) {
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      borderWidth: number;
      fill: boolean;
      tension: number;
      pointBackgroundColor: string;
      pointBorderColor: string;
      pointBorderWidth: number;
      pointRadius: number;
      pointHoverRadius: number;
      spanGaps: boolean;
    }>;
  }>({ labels: [], datasets: [] });

  useEffect(() => {
    console.log("CombinedVisitorTrendsChart - analytics:", analytics);
    console.log("CombinedVisitorTrendsChart - dailyVisitors:", analytics.dailyVisitors);

    if (analytics.dailyVisitors && analytics.dailyVisitors.length > 0) {
      // Create labels from dates
      const labels = analytics.dailyVisitors.map(daily => daily.date);
      console.log("Chart labels:", labels);

      // Create datasets for each site
      const datasets = analytics.sites.map(site => {
        const color = getSiteColor(site.siteId);
        const siteName = getSiteName(site.siteId);

        // For now, we'll use the combined daily visitors data
        // In a real implementation, you'd want site-specific daily data
        const siteData = analytics.dailyVisitors.map(daily => {
          // Distribute visitors proportionally based on site's total visitors
          const siteRatio = site.visitors / analytics.totalVisitors;
          return Math.round(daily.visitors * siteRatio);
        });

        return {
          label: siteName,
          data: siteData,
          borderColor: color.primary,
          backgroundColor: color.secondary,
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          pointBackgroundColor: color.primary,
          pointBorderColor: color.primary,
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          spanGaps: false,
        };
      });

      console.log("Final chart data:", { labels, datasets });
      setChartData({ labels, datasets });
    } else {
      console.log("No daily visitors data available");
    }
  }, [analytics]);

  // Get time unit and display format based on selected range
  const getTimeConfig = () => {
    switch (selectedRange) {
      case "7d":
        return {
          unit: "day" as const,
          displayFormats: { day: "MMM dd" },
          stepSize: 1,
        };
      case "1m":
        return {
          unit: "day" as const,
          displayFormats: { day: "MMM dd" },
          stepSize: 2,
        };
      case "1y":
        return {
          unit: "month" as const,
          displayFormats: { month: "MMM yyyy" },
          stepSize: 1,
        };
      case "5y":
        return {
          unit: "year" as const,
          displayFormats: { year: "yyyy" },
          stepSize: 1,
        };
      default:
        return {
          unit: "day" as const,
          displayFormats: { day: "MMM dd" },
          stepSize: 1,
        };
    }
  };

  const timeConfig = getTimeConfig();

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
        enabled: true,
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          title: function (context: any[]) {
            return context[0].label;
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: function (context: any) {
            return `${context.dataset.label}: ${context.parsed.y} visitors`;
          }
        }
      },
      datalabels: {
        display: false, // Hide data labels for cleaner look with multiple lines
      },
    },
    scales: {
      x: {
        type: "time" as const,
        time: {
          unit: timeConfig.unit,
          displayFormats: timeConfig.displayFormats,
        },
        grid: {
          display: false,
        },
        ticks: {
          color: "rgb(107, 114, 128)",
          font: {
            size: 12,
          },
          maxTicksLimit: selectedRange === "1m" ? 15 : selectedRange === "1y" ? 12 : selectedRange === "5y" ? 5 : 7,
          rotation: selectedRange === "1m" ? -45 : 0,
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
    layout: {
      padding: {
        top: 20,
        bottom: 10,
        left: 10,
        right: 10,
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 w-full h-[520px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Combined Visitor Trends
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {selectedRange === "7d" ? "Last 7 Days" :
              selectedRange === "1m" ? "Last 30 Days" :
                selectedRange === "1y" ? "Last 12 Months" : "Last 5 Years"}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Daily visitor trends across all websites
        </p>
      </div>

      {/* Chart.js Time Chart */}
      <div className="w-full flex-1" style={{ height: "400px" }}>
        {chartData.datasets.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <div className="text-lg font-medium">No data available</div>
              <div className="text-sm mt-2">
                Debug: {analytics.dailyVisitors?.length || 0} daily visitors, {analytics.sites?.length || 0} sites
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
