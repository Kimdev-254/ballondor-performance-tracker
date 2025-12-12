"use client";

import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function HaalandGraph() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/haaland")
      .then((res) => res.json())
      .then((d) => setData(d.timeline || []));
  }, []);

  const chartData = {
    labels: data.map((d) => d.fixture.split("T")[0]),
    datasets: [
      {
        label: "Haaland Performance Score",
        data: data.map((d) => d.score),
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 4,
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Haaland Graph</h1>
      <Line data={chartData} />
    </div>
  );
}
