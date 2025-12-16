"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";

export default function HaalandPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/haaland")
      .then((res) => res.json())
      .then((json) => {
        const formatted = json.timeline.map((d: any) => ({
          ...d,
          label: new Date(d.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
        }));
        setData(formatted);
      });
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-2">
        Haaland — Ballon d’Or On-Track Index
      </h1>
      <p className="text-gray-500 mb-6">
        Season-to-date performance trajectory
      </p>

      <div className="w-full h-105 bg-white p-4 rounded shadow">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip
              formatter={(value, _, props) => {
                const d = props.payload;
                return [
                  `Index: ${d.index} (${d.delta > 0 ? "+" : ""}${d.delta})`,
                  d.reasons.join(" · "),
                ];
              }}
            />
            <Line
              type="monotone"
              dataKey="index"
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
