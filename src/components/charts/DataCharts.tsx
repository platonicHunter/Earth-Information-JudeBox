"use client";
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { WeatherData } from "@/services/nasaApi";
import { Activity, Droplets, Wind } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface DataChartsProps {
  data: WeatherData[];
  currentIndex: number;
}

export function DataCharts({ data, currentIndex }: DataChartsProps) {
  const chartData = {
    labels: data.map((d) => d.time.substring(4, 8)), // MM-DD
    datasets: [
      {
        label: "Wind (m/s)",
        data: data.map((d) => d.wind),
        borderColor: "rgb(6, 182, 212)", // Cyan
        backgroundColor: "rgba(6, 182, 212, 0.2)",
        yAxisID: "y",
        tension: 0.3,
        pointRadius: (ctx: any) => (ctx.dataIndex === currentIndex ? 6 : 0),
        pointBackgroundColor: "white",
      },
      {
        label: "Rain (mm)",
        data: data.map((d) => d.rain),
        borderColor: "rgb(59, 130, 246)", // Blue
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        yAxisID: "y1",
        tension: 0.3,
        pointRadius: (ctx: any) => (ctx.dataIndex === currentIndex ? 6 : 0),
        pointBackgroundColor: "white",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
    plugins: { legend: { display: false } },
    scales: {
      x: {
        ticks: { color: "#6b7280", maxTicksLimit: 5 },
        grid: { color: "#374151" },
      },
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: { display: true, text: "Wind", color: "#06b6d4" },
        ticks: { color: "#06b6d4" },
        grid: { color: "#374151" },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        title: { display: true, text: "Rain", color: "#3b82f6" },
        ticks: { color: "#3b82f6" },
        grid: { drawOnChartArea: false },
      },
    },
  };

  const maxWind =
    data.length > 0 ? Math.max(...data.map((d) => d.wind)).toFixed(1) : "0";
  const maxRain =
    data.length > 0 ? Math.max(...data.map((d) => d.rain)).toFixed(1) : "0";

  return (
    <div className="bg-[#1a2332] rounded-xl p-4 md:p-5 flex flex-col justify-between border border-gray-800 shadow-xl h-auto lg:h-full shrink-0 w-full">
      {/* 1. Summary Stats */}
      <div className="mb-4">
        <h3 className="text-cyan-500 text-xs tracking-widest font-bold mb-3 flex items-center">
          <Activity className="w-4 h-4 mr-2" /> EVENT SUMMARY
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#0a0f18] p-3 rounded-lg border border-gray-700 text-center shadow-inner">
            <p className="text-[10px] text-gray-500 font-mono mb-1">MAX WIND</p>
            <p className="text-xl font-bold text-cyan-400">
              {maxWind} <span className="text-xs text-gray-500">m/s</span>
            </p>
          </div>
          <div className="bg-[#0a0f18] p-3 rounded-lg border border-gray-700 text-center shadow-inner">
            <p className="text-[10px] text-gray-500 font-mono mb-1">MAX RAIN</p>
            <p className="text-xl font-bold text-blue-400">
              {maxRain} <span className="text-xs text-gray-500">mm</span>
            </p>
          </div>
        </div>
      </div>

      {/* 2. Real-time Chart */}
      <div className="flex-1 min-h-[220px] relative w-full mb-4">
        {data.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full text-xs text-gray-600 border border-dashed border-gray-700 rounded-lg">
            Load data to view chart
          </div>
        )}
      </div>

      {/* 3. Sonification Mapping Legend */}
      {/* 3. Sonification Mapping Legend */}
      <div className="bg-[#0a0f18] p-3 rounded-lg border border-gray-800">
        <h4 className="text-[10px] text-gray-400 tracking-wider mb-2 uppercase text-center font-semibold">
          Audio Mapping Rules
        </h4>
        <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-300">
          <div className="flex items-center">
            <Wind className="w-3 h-3 mr-1 text-green-400" /> Clear: Birds
          </div>
          <div className="flex items-center">
            <Droplets className="w-3 h-3 mr-1 text-cyan-400" /> Rain &lt; 5:
            Light Rain
          </div>
          <div className="flex items-center">
            <Droplets className="w-3 h-3 mr-1 text-blue-500" /> Rain &gt; 5:
            Heavy Rain
          </div>
          <div className="flex items-center">
            <Activity className="w-3 h-3 mr-1 text-yellow-500" /> Storm: Thunder
          </div>
        </div>
      </div>
    </div>
  );
}
