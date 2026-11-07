"use client";

import { Card } from "@/components/ui/card";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface WeatherChartProps {
  data: { time: string; wind: number; rain: number }[];
  currentIndex: number;
}

export function WeatherChart({ data, currentIndex }: WeatherChartProps) {
  const chartData = {
    labels: data.map((d) => d.time.substring(4, 8)), // MM-DD
    datasets: [
      {
        label: "Wind Speed (m/s)",
        data: data.map((d) => d.wind),
        borderColor: "rgb(6, 182, 212)", // Tailwind Cyan-500
        backgroundColor: "rgba(6, 182, 212, 0.5)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const, labels: { color: "#9ca3af" } },
    },
    scales: {
      x: { ticks: { color: "#6b7280" }, grid: { color: "#374151" } },
      y: { ticks: { color: "#6b7280" }, grid: { color: "#374151" } },
    },
  };

  return (
    <Card className="bg-gray-900 border-gray-700 p-4 h-75 w-full flex flex-col">
      <h3 className="text-cyan-500 text-xs tracking-widest font-semibold mb-4">
        WIND SPEED DATA (Chart.js)
      </h3>
      <div className="flex-1 relative w-full h-full">
        {data.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <div className="text-gray-500 text-sm flex items-center justify-center h-full">
            Loading Chart...
          </div>
        )}
      </div>
    </Card>
  );
}
