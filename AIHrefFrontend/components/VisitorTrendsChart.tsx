"use client";

import { EnhancedAnalytics, fetchVisitorTrends } from "@/lib/analytics";
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

interface VisitorTrendsChartProps {
  analytics: EnhancedAnalytics;
  siteId: string;
  onRangeChange?: (range: "7D" | "1M" | "1Y" | "5Y") => void;
}

export default function VisitorTrendsChart({
  analytics,
  siteId,
  onRangeChange,
}: VisitorTrendsChartProps) {
  const [selectedRange, setSelectedRange] = useState<"7D" | "1M" | "1Y" | "5Y">(
    "7D"
  );
  const [chartData, setChartData] = useState<
    { date: string; visitors: number; pageviews: number }[]
  >([]);
  const [loading, setLoading] = useState(false);

  // Convert backend range to API range
  const getApiRange = (
    range: "7D" | "1M" | "1Y" | "5Y"
  ): "7d" | "1m" | "1y" | "5y" => {
    switch (range) {
      case "7D":
        return "7d";
      case "1M":
        return "1m";
      case "1Y":
        return "1y";
      case "5Y":
        return "5y";
      default:
        return "7d";
    }
  };

  // Fetch visitor trends data based on selected range
  const fetchVisitorTrendsData = async (range: "7D" | "1M" | "1Y" | "5Y") => {
    try {
      setLoading(true);
      const apiRange = getApiRange(range);

      // Try to fetch fresh data from the API
      try {
        const trendsData = await fetchVisitorTrends(siteId, apiRange);

        // Use API data directly, converting to the expected format
        const chartData = trendsData.map((trend) => ({
          date: trend.date,
          visitors: trend.visitors,
          pageviews: trend.pageviews || 0,
        }));

        console.log("API data:", chartData);
        setChartData(chartData);
      } catch (apiError) {
        console.warn("API fetch failed, using analytics data:", apiError);

        // Fallback: Use the daily visitor trends from analytics if available
        if (
          analytics.dailyVisitorTrends &&
          analytics.dailyVisitorTrends.length > 0
        ) {
          // Use analytics data directly
          const chartData = analytics.dailyVisitorTrends.map((trend) => ({
            date: trend.date,
            visitors: trend.visitors,
            pageviews: trend.pageviews || 0,
          }));

          console.log("Analytics data:", chartData);
          setChartData(chartData);
        } else {
          // Final fallback: use empty data structure
          const baseData = generateTrendData(range);
          console.log("Using base data (no analytics data):", baseData);
          setChartData(baseData);
        }
      }
    } catch (error) {
      console.error("Error fetching visitor trends:", error);
      // Fallback to empty data structure
      const trends = generateTrendData(range);
      setChartData(trends);
    } finally {
      setLoading(false);
    }
  };

  // Generate data relative to current date with exact patterns from images
  const generateTrendData = (range: "7D" | "1M" | "1Y" | "5Y") => {
    const data: { date: string; visitors: number; pageviews: number }[] = [];
    const now = new Date();

    switch (range) {
      case "7D":
        // Last 7 days from current date - exact pattern from 7D image
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split("T")[0];
          data.push({ date: dateStr, visitors: 0, pageviews: 0 });
        }
        break;

      case "1M":
        // Last 30 days from current date - exact pattern from 1M image
        for (let i = 29; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split("T")[0];
          data.push({ date: dateStr, visitors: 0, pageviews: 0 });
        }
        break;

      case "1Y":
        // Last 12 months from current date - exact pattern from 1Y image
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now);
          date.setMonth(date.getMonth() - i);
          date.setDate(1); // First day of the month
          const dateStr = date.toISOString().split("T")[0];
          data.push({ date: dateStr, visitors: 0, pageviews: 0 });
        }
        break;

      case "5Y":
        // Last 5 years from current date - exact pattern from 5Y image
        const currentYear = now.getFullYear();
        for (let i = 4; i >= 0; i--) {
          const year = currentYear - i;
          const dateStr = `${year}-01-01`;
          data.push({ date: dateStr, visitors: 0, pageviews: 0 });
        }
        break;
    }

    return data;
  };

  // Handle range change
  const handleRangeChange = (range: "7D" | "1M" | "1Y" | "5Y") => {
    setSelectedRange(range);
    fetchVisitorTrendsData(range);
    // Don't call onRangeChange to prevent dashboard reload
    // The chart will handle its own data fetching
  };

  // Load initial data
  useEffect(() => {
    fetchVisitorTrendsData(selectedRange);
  }, [analytics, selectedRange]);

  // Ensure chartData is properly initialized
  const safeChartData = chartData && Array.isArray(chartData) ? chartData : [];

  // Debug logging
  console.log("Chart data for range", selectedRange, ":", safeChartData);
  console.log("Chart labels:", safeChartData.map((point) => point.date));
  console.log("Chart values:", safeChartData.map((point) => point.visitors));

  const data = {
    labels: safeChartData.map((point) => point.date),
    datasets: [
      {
        label: "Visits",
        data: safeChartData.map((point) => {
          const visitCount =
            typeof point.visitors === "number" ? point.visitors : 0;
          console.log(`Data point: ${point.date}, visitors: ${visitCount}`);
          return visitCount;
        }),
        borderColor: "rgb(156, 163, 175)", // Light gray line like in images
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 2,
        fill: false, // No fill like in the images
        tension: 0.4,
        pointBackgroundColor: "rgb(156, 163, 175)", // Light gray points
        pointBorderColor: "rgb(156, 163, 175)",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        spanGaps: false,
      },
    ],
  };

  // Get time unit and display format based on selected range
  const getTimeConfig = () => {
    switch (selectedRange) {
      case "7D":
        return {
          unit: "day" as const,
          displayFormats: { day: "yyyy-MM-dd" },
          stepSize: 1,
        };
      case "1M":
        return {
          unit: "day" as const,
          displayFormats: { day: "yyyy-MM-dd" },
          stepSize: 2,
        };
      case "1Y":
        return {
          unit: "month" as const,
          displayFormats: { month: "MMM-yyyy" },
          stepSize: 1,
        };
      case "5Y":
        return {
          unit: "year" as const,
          displayFormats: { year: "yyyy" },
          stepSize: 1,
        };
      default:
        return {
          unit: "day" as const,
          displayFormats: { day: "yyyy-MM-dd" },
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
        display: false,
      },
      tooltip: {
        enabled: true, // Enable tooltips to help debug
        callbacks: {
          title: function (context: any) {
            return context[0].label;
          },
          label: function (context: any) {
            return `Visitors: ${context.parsed.y}`;
          }
        }
      },
      datalabels: {
        display: true,
        color: "rgb(59, 130, 246)", // Blue color like in images
        font: {
          size: 14,
          weight: "bold" as const,
        },
        anchor: "end" as const,
        align: "top" as const,
        offset: 8,
        borderWidth: 1,
        borderRadius: 4,
        padding: {
          top: 2,
          bottom: 2,
          left: 4,
          right: 4,
        },
        formatter: function (value: number) {
          // Only show labels for non-zero values
          if (typeof value === "number" && value > 0) {
            return value;
          }
          return "";
        },
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
          display: false, // No grid lines like in the images
        },
        ticks: {
          color: "rgb(107, 114, 128)",
          font: {
            size: 12,
          },
          maxTicksLimit:
            selectedRange === "1M"
              ? 15
              : selectedRange === "1Y"
                ? 12
                : selectedRange === "5Y"
                  ? 5
                  : 7,
          rotation: selectedRange === "1M" ? -45 : 0, // Rotate dates for 1M view
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: false, // No grid lines like in the images
        },
        ticks: {
          display: false, // Hide Y-axis labels like in the images
        },
        // Add padding to ensure labels have space
        grace: "10%",
      },
    },
    // Add layout padding to ensure labels are not cut off
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
          Visitor Trends
        </h3>
        <div className="flex space-x-1">
          {(["7D", "1M", "1Y", "5Y"] as const).map((range) => (
            <button
              key={range}
              onClick={() => handleRangeChange(range)}
              disabled={loading}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${selectedRange === range
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading && selectedRange === range ? "..." : range}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Visits -{" "}
          {selectedRange === "7D"
            ? "Last 7 Days"
            : selectedRange === "1M"
              ? "Last 30 Days"
              : selectedRange === "1Y"
                ? "Last 12 Months"
                : "Last 5 Years"}
        </p>
      </div>

      {/* Chart.js Time Chart */}
      <div className="w-full flex-1" style={{ height: "400px" }}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : safeChartData.length > 0 ? (
          <Line data={data} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <div className="text-lg font-medium">Loading...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
