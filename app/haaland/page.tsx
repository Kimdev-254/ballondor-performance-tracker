"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function HaalandPage() {
  // Convert fixture date → short readable label
  const rawData = [
    {
      fixture: "2024-02-05T20:00:00+00:00",
      score: 68,
    },
  ];

  const data = rawData.map((match) => ({
    ...match,
    // Format date for the graph
    dateLabel: new Date(match.fixture).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Haaland Performance</h1>

      <div className="w-full h-100 bg-white p-4 rounded shadow">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dateLabel" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#22c55e"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
