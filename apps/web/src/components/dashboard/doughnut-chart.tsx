"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

type ChartData = {
  label: string;
  value: number;
  color: string;
};

interface DoughnutChartProps {
  data: ChartData[];
  size?: number; // Size is now handled via responsive container, but keeping for compatibility if needed
}

export function DoughnutChart({ data }: DoughnutChartProps) {
  return (
    <div className="relative h-[120px] w-[120px] sm:h-[140px] sm:w-[140px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="65%"
            outerRadius="100%"
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any, name: any) => [`${value}%`, name]}
            contentStyle={{
              backgroundColor: "var(--color-card)",
              borderColor: "var(--color-border)",
              borderRadius: "8px",
            }}
            itemStyle={{ color: "var(--color-foreground)" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
