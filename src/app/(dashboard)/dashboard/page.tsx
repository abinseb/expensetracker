import { connection } from "next/server";
import { getDashboardData } from "@/src/lib/actions/dashboard-actions";
import { DashboardCharts } from "./_components/DashboardCharts";

export const instant = false;

export default async function DashboardPage() {
  await connection();
  const now = new Date();
  const data = await getDashboardData(now.getFullYear(), now.getMonth() + 1);

  if (!data) return null;

  const { balance, summary, breakdown, daily, recent } = data;

  const monthName = now.toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-zinc-400 text-sm mt-1">{monthName} — Financial Overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-card p-6">
          <p className="text-zinc-400 text-sm mb-1">Total Income</p>
          <p className="text-2xl font-bold text-emerald-400">
            ₹{Number(summary.total_income).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-zinc-500 mt-1">This month</p>
        </div>

        <div className="glass-card p-6">
          <p className="text-zinc-400 text-sm mb-1">Total Expenses</p>
          <p className="text-2xl font-bold text-red-400">
            ₹{Number(summary.total_expenses).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-zinc-500 mt-1">This month</p>
        </div>

        <div className="glass-card p-6">
          <p className="text-zinc-400 text-sm mb-1">Current Balance</p>
          <p className={`text-2xl font-bold ${Number(balance.balance) >= 0 ? "text-indigo-400" : "text-red-400"}`}>
            ₹{Number(balance.balance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-zinc-500 mt-1">All-time</p>
        </div>
      </div>

      {/* Charts */}
      <DashboardCharts breakdown={breakdown} daily={daily} />

      {/* Recent Transactions */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
        {recent.length === 0 ? (
          <p className="text-zinc-500 text-sm text-center py-8">
            No transactions yet. Start by adding your salary or expenses!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((tx: Record<string, string | number>) => (
                  <tr key={tx.id}>
                    <td className="text-zinc-300 text-sm">
                      {new Date(tx.date as string).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                    <td className="text-zinc-300 text-sm">{tx.description || "—"}</td>
                    <td className="text-sm">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800/50 text-zinc-300">
                        {tx.category_icon} {tx.category_name || "Uncategorized"}
                      </span>
                    </td>
                    <td className={`text-sm font-medium text-right ${tx.type === "credit" ? "text-emerald-400" : "text-red-400"}`}>
                      {tx.type === "credit" ? "+" : "-"}₹{Number(tx.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
