"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface TrendData {
  month: string;
  income: string;
  expenses: string;
}

export function ReportCharts({ trend }: { trend: TrendData[] }) {
  const chartData = trend.map((t) => ({
    month: new Date(t.month).toLocaleDateString("en-IN", {
      month: "short",
      year: "2-digit",
    }),
    Income: Number(t.income),
    Expenses: Number(t.expenses),
  }));

  return (
    <div className="glass-card p-6">
      <h2 className="text-lg font-semibold mb-4">Monthly Trends</h2>

      {chartData.length === 0 ? (
        <p className="text-zinc-500 text-sm text-center py-12">
          Not enough data to show trends. Keep tracking your expenses!
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis
              dataKey="month"
              tick={{ fill: "#71717a", fontSize: 12 }}
              axisLine={{ stroke: "#27272a" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#71717a", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) =>
                `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
              }
            />
            <Tooltip
              contentStyle={{
                background: "rgba(24, 24, 27, 0.95)",
                border: "1px solid rgba(63, 63, 70, 0.5)",
                borderRadius: "12px",
                color: "#fafafa",
                fontSize: "13px",
              }}
              formatter={(value) =>
                `₹${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
              }
            />
            <Legend wrapperStyle={{ fontSize: "12px", color: "#a1a1aa" }} />
            <Area
              type="monotone"
              dataKey="Income"
              stroke="#22c55e"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#incomeGradient)"
            />
            <Area
              type="monotone"
              dataKey="Expenses"
              stroke="#ef4444"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#expenseGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
