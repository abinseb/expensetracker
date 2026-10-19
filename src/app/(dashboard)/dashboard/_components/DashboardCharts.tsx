"use client";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#6366f1", "#a78bfa", "#22c55e", "#f59e0b", "#ef4444",
  "#ec4899", "#14b8a6", "#f97316", "#8b5cf6", "#06b6d4",
];

interface DashboardChartsProps {
  breakdown: Array<{
    id: number;
    name: string;
    icon: string;
    category_type: string;
    total: string;
    transaction_count: string;
  }>;
  daily: Array<{
    date: string;
    type: string;
    total: string;
  }>;
}

export function DashboardCharts({ breakdown, daily }: DashboardChartsProps) {
  // Filter expense breakdown for pie chart
  const expenseBreakdown = breakdown
    .filter((b) => b.category_type === "expense")
    .map((b) => ({
      name: `${b.icon} ${b.name}`,
      value: Number(b.total),
    }));

  // Transform daily data for bar chart
  const dailyMap = new Map<string, { date: string; income: number; expenses: number }>();
  daily.forEach((d) => {
    const dateStr = new Date(d.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    const existing = dailyMap.get(dateStr) || { date: dateStr, income: 0, expenses: 0 };
    if (d.type === "credit") {
      existing.income += Number(d.total);
    } else {
      existing.expenses += Number(d.total);
    }
    dailyMap.set(dateStr, existing);
  });
  const dailyData = Array.from(dailyMap.values());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Category Pie Chart */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4">Expense Breakdown</h2>
        {expenseBreakdown.length === 0 ? (
          <p className="text-zinc-500 text-sm text-center py-12">No expense data this month</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={expenseBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {expenseBreakdown.map((_entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
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
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{ fontSize: "12px", color: "#a1a1aa" }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Daily Bar Chart */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4">Daily Activity</h2>
        {dailyData.length === 0 ? (
          <p className="text-zinc-500 text-sm text-center py-12">No transaction data this month</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dailyData} barGap={2}>
              <XAxis
                dataKey="date"
                tick={{ fill: "#71717a", fontSize: 11 }}
                axisLine={{ stroke: "#27272a" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#71717a", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
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
              <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} name="Income" />
              <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
