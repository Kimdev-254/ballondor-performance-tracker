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
import { useEffect, useState } from "react";

type DataPoint = {
  fixture: string;
  score: number;
};

export default function HaalandPage() {
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    fetch("/api/haaland")
      .then((res) => res.json())
      .then((json) => {
        const formatted = json.timeline.map(
          (d: DataPoint) => ({
            ...d,
            dateLabel: new Date(d.fixture).toLocaleDateString(
              "en-US",
              { month: "short", day: "numeric" }
            ),
          })
        );
        setData(formatted);
      });
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        Haaland Performance
      </h1>

      <div className="w-full h-105 bg-white rounded shadow p-4">
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
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
