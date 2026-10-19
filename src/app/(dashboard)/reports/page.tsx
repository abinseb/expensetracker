import { connection } from "next/server";
import { getReportData } from "@/src/lib/actions/dashboard-actions";
import { ReportCharts } from "./_components/ReportCharts";

export const instant = false;

export default async function ReportsPage() {
  await connection();
  const data = await getReportData(12);

  if (!data) return null;

  const { breakdown, trend } = data;

  // Calculate totals for percentage
  const totalExpenses = breakdown
    .filter((b: { category_type: string }) => b.category_type === "expense")
    .reduce((sum: number, b: { total: string }) => sum + Number(b.total), 0);

  const expenseBreakdown = breakdown
    .filter((b: { category_type: string }) => b.category_type === "expense")
    .map((b: { id: number; name: string; icon: string; total: string; transaction_count: string }) => ({
      ...b,
      total: Number(b.total),
      percentage: totalExpenses > 0 ? ((Number(b.total) / totalExpenses) * 100).toFixed(1) : "0",
      count: Number(b.transaction_count),
    }));

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Detailed analysis of your spending patterns
        </p>
      </div>

      {/* Monthly Trend Chart */}
      <ReportCharts trend={trend} />

      {/* Category Breakdown Table */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4">
          Category-wise Expenses{" "}
          <span className="text-zinc-500 text-sm font-normal">(This Month)</span>
        </h2>

        {expenseBreakdown.length === 0 ? (
          <p className="text-zinc-500 text-sm text-center py-8">
            No expense data available for this month
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th className="text-right">Transactions</th>
                  <th className="text-right">Amount</th>
                  <th className="text-right">% of Total</th>
                  <th>Distribution</th>
                </tr>
              </thead>
              <tbody>
                {expenseBreakdown.map((item: { id: number; name: string; icon: string; total: number; count: number; percentage: string }) => (
                  <tr key={item.id}>
                    <td>
                      <span className="inline-flex items-center gap-2 text-sm">
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-zinc-200">{item.name}</span>
                      </span>
                    </td>
                    <td className="text-zinc-400 text-sm text-right">{item.count}</td>
                    <td className="text-red-400 text-sm font-medium text-right">
                      ₹{item.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="text-zinc-300 text-sm text-right">{item.percentage}%</td>
                    <td>
                      <div className="w-full max-w-[120px] h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-zinc-700/50">
                  <td className="font-medium text-sm pt-3">Total</td>
                  <td className="text-zinc-400 text-sm text-right pt-3">
                    {expenseBreakdown.reduce((s: number, i: { count: number }) => s + i.count, 0)}
                  </td>
                  <td className="text-red-400 text-sm font-bold text-right pt-3">
                    ₹{totalExpenses.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="text-zinc-300 text-sm text-right pt-3">100%</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
